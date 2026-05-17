// server/server.js (ESM)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Enable CORS so your Vite/CRA frontend (likely at http://localhost:5173 or http://localhost:3000) can call the proxy
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);
      // adjust allowed origins as needed
      const allowed = ["http://localhost:5173", "http://localhost:3000"];
      if (allowed.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);
app.use(express.json());

const GOPHISH_HOST = process.env.GOPHISH_HOST; // e.g. https://gophish.example:3333
const GOPHISH_APIKEY = process.env.GOPHISH_APIKEY; // keep secret

if (!GOPHISH_HOST || !GOPHISH_APIKEY) {
  console.warn(
    "Warning: GOPHISH_HOST or GOPHISH_APIKEY not set in .env — proxy endpoints will return errors until configured."
  );
}

// ===== AUTHENTICATION ENDPOINT =====
// Demo user credentials (In production, use a proper database with hashed passwords)
const DEMO_USERS = [
  {
    username: 'admin@company.com',
    password: 'Admin@123', // Strong password: 8+ chars, uppercase, lowercase, number, special char
    name: 'Admin User'
  },
  {
    username: 'user@company.com',
    password: 'User@2024!',
    name: 'Regular User'
  }
];

// Password strength validation function (Relaxed for demo)
const validatePasswordStrength = (password) => {
  const errors = [];
  if (password.length < 4) {
    errors.push('Password must be at least 4 characters long');
  }
  return errors;
};

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Username and password are required'
    });
  }

  // Find user - authenticate FIRST before any other validation
  const user = DEMO_USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid username or password'
    });
  }

  // Generate a simple token (In production, use JWT with proper secret)
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

  return res.status(200).json({
    ok: true,
    message: 'Login successful',
    token,
    user: {
      username: user.username,
      name: user.name
    }
  });
});

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({
      ok: false,
      message: 'All fields (name, email, password) are required'
    });
  }

  // Check if user already exists
  const existingUser = DEMO_USERS.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({
      ok: false,
      message: 'User already exists with this email'
    });
  }

  // Validate password strength
  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      ok: false,
      message: 'Password is too weak',
      errors: passwordErrors
    });
  }

  // Create new user (Demo: in-memory only)
  const newUser = {
    username,
    password, // In production, hash this password!
    name
  };

  DEMO_USERS.push(newUser);

  return res.status(201).json({
    ok: true,
    message: 'User registered successfully',
    user: {
      username: newUser.username,
      name: newUser.name
    }
  });
});

// Health/ping endpoint for frontend probe
app.get("/api/gophish/ping", async (req, res) => {
  if (!GOPHISH_HOST || !GOPHISH_APIKEY) {
    return res
      .status(500)
      .json({ ok: false, message: "Gophish proxy not configured." });
  }
  try {
    const r = await fetch(`${GOPHISH_HOST}/api/ping`, {
      method: "GET",
      headers: { Authorization: GOPHISH_APIKEY },
      // additional options like timeout can be added
    });
    const j = await r.json().catch(() => null);
    return res.status(r.status).json(j ?? { ok: r.ok });
  } catch (e) {
    console.error("Ping error:", e.message);
    return res.status(502).json({ ok: false, message: e.message });
  }
});

// GET templates (proxied)
app.get("/api/gophish/templates", async (req, res) => {
  if (!GOPHISH_HOST || !GOPHISH_APIKEY) {
    return res
      .status(500)
      .json({ ok: false, message: "Gophish proxy not configured." });
  }
  try {
    const r = await fetch(`${GOPHISH_HOST}/api/templates/`, {
      method: "GET",
      headers: { Authorization: GOPHISH_APIKEY },
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    console.error("Templates fetch error:", e.message);
    return res.status(502).json({ ok: false, message: e.message });
  }
});

// Example simple passthrough route (caution: validate and limit in production)
app.use("/api/gophish", async (req, res) => {
  // Very small proxy: forwards method/path and body to Gophish, returns JSON
  if (!GOPHISH_HOST || !GOPHISH_APIKEY) {
    return res
      .status(500)
      .json({ ok: false, message: "Gophish proxy not configured." });
  }

  // build target url
  const targetUrl = `${GOPHISH_HOST}/api${req.path}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        Authorization: GOPHISH_APIKEY,
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      // forward body when present
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    };

    const r = await fetch(targetUrl, fetchOptions);
    const contentType = r.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await r.json();
      return res.status(r.status).json(json);
    } else {
      const text = await r.text();
      res.status(r.status).send(text);
    }
  } catch (e) {
    console.error("Proxy error:", e.message);
    res.status(502).json({ ok: false, message: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}`));
