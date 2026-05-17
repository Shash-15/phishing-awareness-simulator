import React from "react";
import { createRoot } from "react-dom/client";
import PhishingAwarenessSimulator from "./PhishingAwarenessSimulator";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PhishingAwarenessSimulator />
  </React.StrictMode>
);
