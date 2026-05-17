import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import IntroPage from "./IntroPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import "./AppStyles.css";


// Phishing Awareness Simulator (Integrated System) - single-file React component

const getDynamicDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SAMPLE_EMAILS = [
  {
    id: "Email 1",
    from: "IT Security <it-support@secure-portal-update.com>",
    subject: "REQUIRED: Security Certificate Update",
    snippet: `Your workstation security certificate expires on ${getDynamicDate(-1)}. Action is required.`,
    body: `Dear employee,\n\nOur records indicate that your workstation security certificate is set to expire on ${getDynamicDate(-1)}. To maintain access to the corporate network and internal resources, you must install the updated certificate manually.\n\nPlease follow the link below to download the updater tool:\nhttp://internal-portal-update.com/download/security_patch_ext.exe\n\nFailure to update by EOD will result in account suspension.\n\nRegards,\nGlobal IT Support Team`,
    isPhishing: true,
  },
  {
    id: "Email 2",
    from: "The New York Times <news@nytimes.com>",
    subject: "Evening Briefing: Today's Top Headlines",
    snippet: "The latest news and analysis, delivered to your inbox every evening.",
    body: `Good evening,\n\nHere are the stories we're following today:\n- Economic indicators show steady growth in Q1.\n- New discoveries in renewable energy tech.\n- Highlights from the global film festival.\n\nRead more on our website or mobile app.\n\nThank you for being a subscriber.`,
    isPhishing: false,
  },
  {
    id: "Email 3",
    from: "CEO <office-ceo@internal-corp-mail.net>",
    subject: "CONFIDENTIAL: Urgent Wire Transfer",
    snippet: "I need you to handle a quick payment for a sensitive acquisition.",
    body: "Hi,\n\nI'm currently in a series of back-to-back meetings and can't use my phone. We have a sensitive acquisition closing today and I need a wire transfer of $82,450 processed immediately to a new vendor.\n\nI have authorized this on my end. Please reply with 'Confirmed' and I will send over the account details quietly. This must stay between us for now.\n\nSent from my iPad",
    isPhishing: true,
  },
  {
    id: "Email 5",
    from: "Amazon Shipments <order-update@amazon.com>",
    subject: "Your package has been delivered!",
    snippet: "Order #112-9983421-00928 has arrived at its destination.",
    body: `Hi Customer,\n\nYour package was delivered today, ${getDynamicDate(0)}. \n\nShipment details:\nOrder #112-9983421-00928\nDelivered to: Front Porch\n\nIf you have any issues with this delivery, please visit the Help section on our website.\n\nThanks for shopping with us!`,
    isPhishing: false,
  },
  {
    id: "Email 6",
    from: "Netflix Billing <info@netflix-account-verify.com>",
    subject: "Action Required: Update your payment method",
    snippet: "We're having some trouble with your current billing information.",
    body: "Dear Member,\n\nWe were unable to process your most recent payment. To keep enjoying Netflix without interruption, please update your payment details as soon as possible.\n\nClick the button below to sign in and update your account:\n[ Update Payment Method ]\nhttp://netflix-billing-check.com/login\n\nIf you have questions, we're here to help. Visit the Help Center at netflix.com/help.",
    isPhishing: true,
  },
  {
    id: "Email 7",
    from: "LinkedIn <notifications@linkedin.com>",
    subject: "You appeared in 12 searches this week",
    snippet: "See who's looking at your profile and what they're searching for.",
    body: `Hi there,\n\nYour profile is getting noticed! You appeared in 12 searches between ${getDynamicDate(7)} and ${getDynamicDate(0)}.\n\nSee the companies where people work who searched for you:\n- Tech Solutions Inc.\n- Global Finance Partners\n- Creative Agency Ltd.\n\nLog in to see the full list.`,
    isPhishing: false,
  },
  {
    id: "Email 8",
    from: "Microsoft 365 <no-reply@microsoft-office-verify.org>",
    subject: "Alert: Multiple failed login attempts",
    snippet: "We detected several failed login attempts on your account from Moscow, RU.",
    body: `User Security Alert,\n\nA recent login attempt from an unrecognized device or location was detected on your Microsoft 365 account.\n\nLocation: Moscow, Russia\nIP Address: 185.12.44.102\nDate: ${new Date().toUTCString()}\n\nIf this was not you, please secure your account immediately by clicking the button below:\n[ SECURE ACCOUNT ]\nhttp://microsoft-verify-identity.org/security/challenge\n\nMicrosoft Security Team`,
    isPhishing: true,
  },
  {
    id: "Email 9",
    from: "Adobe Sign <document@adobesign.com>",
    subject: "Signature requested: Employee_Handbook_2026.pdf",
    snippet: "HR Department has sent you a document to sign via Adobe Sign.",
    body: "Hello,\n\nHR Department has requested your digital signature for the 'Employee_Handbook_2026.pdf'.\n\nPlease review and sign the document at your earliest convenience.\n\n[ Review and Sign Document ]\n\nThank you,\nAdobe Sign Team",
    isPhishing: false,
  },
  {
    id: "Email 10",
    from: "PayPal Service <support@pay-pal-billing-info.net>",
    subject: "Notification of Unauthorized Transaction",
    snippet: "A payment of $499.00 USD to 'CryptoExchange' is pending.",
    body: `Dear Customer,\n\nYou have sent a payment of $499.00 USD to CryptoExchange.\n\nIf you did not authorize this transaction, please click the link below to cancel the payment and claim a full refund:\nhttp://paypal-security-center.net/dispute/transaction_id?998273\n\nIf no action is taken within 24 hours, the transaction will be processed.\n\nSincerely,\nPayPal Security`,
    isPhishing: true,
  }
];

const SAMPLE_QUIZ = [
  {
    id: "Question 1",
    question: "What is a common sign that an email is a phishing attempt?",
    options: [
      "Professional email domain",
      "Urgent request to click a link",
      "Correct grammar and spelling",
      "Personalized greeting with your full name",
    ],
    answerIndex: 1,
    explanation:
      "Phishing emails often use urgent language (e.g., 'Act now!', 'Immediate action required') to pressure you into acting without thinking.",
  },
  {
    id: "Question 2",
    question: "You receive an email from your 'CEO' asking for a wire transfer. What should you do?",
    options: [
      "Process it immediately to show efficiency",
      "Reply asking for the bank details",
      "Verify the request through a secondary channel (e.g., call or slack)",
      "Ignore it completely",
    ],
    answerIndex: 2,
    explanation: "CEO Fraud (Business Email Compromise) is common. Always verify unusual financial requests using a different communication method like a phone call.",
  },
  {
    id: "Question 3",
    question: "Which of the following URLs is most likely malicious?",
    options: [
      "https://www.google.com",
      "http://secure-login-apple-support.com.xyz",
      "https://www.microsoft.com/support",
      "https://amazon.com",
    ],
    answerIndex: 1,
    explanation: "Look closely at the domain. 'secure-login-apple-support.com.xyz' uses a long subdomain to trick you, but the actual domain is '.xyz', which is suspicious for a major brand.",
  }
];

const STORAGE_KEY = "phish_sim_stats_v1";

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return { emailsSeen: 0, correctIdentifications: 0, quizAttempts: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load stats", e);
    return { emailsSeen: 0, correctIdentifications: 0, quizAttempts: [] };
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats", e);
  }
}

export default function PhishingAwarenessSimulator() {
  const [currentPage, setCurrentPage] = useState("intro"); // intro, login, app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const [view, setView] = useState("simulator");
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [stats, setStats] = useState(() => loadStats());
  const [currentEmail, setCurrentEmail] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [gophishAvailable, setGophishAvailable] = useState(false);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    async function probe() {
      try {
        const res = await fetch("/api/gophish/ping");
        if (res.ok) setGophishAvailable(true);
      } catch (e) {
        setGophishAvailable(false);
      }
    }
    probe();
  }, []);

  function handleEmailDecision(emailId, decisionIsPhishing) {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return;

    const correct = email.isPhishing === decisionIsPhishing;

    const newStats = { ...stats };
    newStats.emailsSeen = (newStats.emailsSeen || 0) + 1;
    if (correct)
      newStats.correctIdentifications =
        (newStats.correctIdentifications || 0) + 1;

    setStats(newStats);

    setCurrentEmail({ ...email, userDecision: decisionIsPhishing, correct });
  }

  function closeEmailFeedback() {
    setCurrentEmail(null);
  }

  async function importTemplatesFromGophish() {
    try {
      const res = await fetch("/api/gophish/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      const mapped = (data.templates || []).slice(0, 6).map((t, i) => ({
        id: `g_${t.id}`,
        from: t.from_name
          ? `${t.from_name} <${t.from_email}>`
          : t.from_email || "no-reply@example.com",
        subject: t.name || `Template ${t.id}`,
        snippet: (t.html || "").replace(/<[^>]+>/g, "").slice(0, 80),
        body: t.html || "HTML content",
        isPhishing: true,
      }));
      setEmails((prev) => [...mapped, ...prev]);
      alert(`Imported ${mapped.length} templates from the backend system.`);
    } catch (e) {
      console.error(e);
      alert("Could not import templates. Check your server configuration.");
    }
  }

  function answerQuiz(optionIndex) {
    const q = SAMPLE_QUIZ[quizIndex];
    const correct = optionIndex === q.answerIndex;
    const attempt = {
      questionId: q.id,
      chosen: optionIndex,
      correct,
      timestamp: new Date().toISOString(),
    };
    const newStats = { ...stats };
    newStats.quizAttempts = [...(newStats.quizAttempts || []), attempt];
    setStats(newStats);
    setQuizAnswers((prev) => [...prev, attempt]);
  }

  function nextQuiz() {
    setQuizIndex((i) => Math.min(SAMPLE_QUIZ.length - 1, i + 1));
  }

  function prevQuiz() {
    setQuizIndex((i) => Math.max(0, i - 1));
  }

  function resetProgress() {
    const base = { emailsSeen: 0, correctIdentifications: 0, quizAttempts: [] };
    setStats(base);
    saveStats(base);
  }

  function handleLogin(user, password) {
    setUsername(user);
    setIsLoggedIn(true);
    setCurrentPage("app");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentPage("intro");
  }

  const dashboardData = [
    { name: "Emails", value: stats.emailsSeen || 0 },
    { name: "Correct", value: stats.correctIdentifications || 0 },
    { name: "Quiz Ops", value: (stats.quizAttempts || []).length },
  ];

  /* --- Render Logic --- */

  if (currentPage === "intro") {
    return <IntroPage onStart={() => setCurrentPage("login")} />;
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setCurrentPage("intro")}
        onSignUp={() => setCurrentPage("signup")}
      />
    );
  }

  if (currentPage === "signup") {
    return (
      <SignUpPage
        onSignUpSuccess={(registeredUser) => {
          // You could optionally auto-login here, 
          // but redirecting to login is safer for demo confirmation
          localStorage.setItem('lastUser', registeredUser);
          setCurrentPage("login");
        }}
        onBackToLogin={() => setCurrentPage("login")}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PhishSim Logo"
              style={{ width: 56, height: 56, objectFit: 'contain' }}
            />
            <h2 className="text-xl font-semibold text-slate-800">Security Portal</h2>
            {gophishAvailable ? (
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Connected
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                Offline Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 hidden sm:block">
              Welcome, <strong className="text-slate-900">{username || "User"}</strong>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <nav className="nav-bar">
          <NavButton
            active={view === "simulator"}
            onClick={() => setView("simulator")}
          >
            📧 Simulator
          </NavButton>
          <NavButton active={view === "quiz"} onClick={() => setView("quiz")}>
            🧠 Quiz
          </NavButton>
          <NavButton
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          >
            📊 Dashboard
          </NavButton>

          <div className="ml-auto flex gap-2">
            <button className="nav-btn inactive" onClick={() => setEmails(shuffleArray(emails))}>
              Shuffle
            </button>
            <button className="nav-btn inactive" onClick={resetProgress}>
              Reset
            </button>
          </div>
        </nav>

        {view === "simulator" && (
          <section className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Email Simulation</h3>
              <p className="text-slate-600">Inspect the emails below. Hover over them and click properties to analyze.</p>
            </div>

            <div className="grid-layout">
              {emails.map((email) => (
                <EmailCard
                  key={email.id}
                  email={email}
                  onDecide={handleEmailDecision}
                />
              ))}
            </div>
          </section>
        )}

        {view === "quiz" && (
          <section className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Knowledge Check</h3>
              <p className="text-slate-600">Test your understanding of phishing concepts.</p>
            </div>

            <QuizCard
              questionObj={SAMPLE_QUIZ[quizIndex]}
              onAnswer={(i) => answerQuiz(i)}
              userAttempts={quizAnswers.filter(
                (a) => a.questionId === SAMPLE_QUIZ[quizIndex].id
              )}
            />

            <div className="flex gap-4 mt-8">
              <button className="nav-btn inactive" onClick={prevQuiz}>Previous</button>
              <button className="nav-btn inactive" onClick={nextQuiz}>Next Question</button>
            </div>
          </section>
        )}

        {view === "dashboard" && (
          <section className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Performance</h3>
              <p className="text-slate-600">Real-time analytics of your training progress.</p>
            </div>

            <div className="dashboard-grid">
              <div className="metric-card">
                <p className="text-slate-500 font-medium">Emails Analyzed</p>
                <div className="metric-value">{stats.emailsSeen || 0}</div>
              </div>
              <div className="metric-card">
                <p className="text-slate-500 font-medium">Threats Caught</p>
                <div className="metric-value">{stats.correctIdentifications || 0}</div>
              </div>
              <div className="metric-card">
                <p className="text-slate-500 font-medium">Quiz Attempts</p>
                <div className="metric-value">{(stats.quizAttempts || []).length}</div>
              </div>
            </div>

            <div className="metric-card" style={{ marginTop: '2rem', height: '350px' }}>
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Activity Overview</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={60} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {currentEmail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-slide-up" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">Feedback Report</h4>
                  <p className="text-sm text-slate-500">Analysis of your decision</p>
                </div>
                <button onClick={closeEmailFeedback} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6 font-mono text-sm leading-relaxed text-slate-700">
                <div className="mb-2"><strong>From:</strong> {currentEmail.from}</div>
                <div className="mb-2"><strong>Subject:</strong> {currentEmail.subject}</div>
                <div className="whitespace-pre-wrap mt-4 border-t pt-4">{currentEmail.body}</div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className={`p-4 rounded-lg flex items-center gap-4 ${currentEmail.correct ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                  }`}>
                  <span className="text-3xl">{currentEmail.correct ? '🛡️' : '🚨'}</span>
                  <div>
                    <p className="font-bold text-lg">
                      {currentEmail.correct ? "Excellent Evaluation!" : "Threat Missed / False Alarm"}
                    </p>
                    <p className="opacity-90">
                      You marked this as <strong>{currentEmail.userDecision ? "Phishing" : "Safe"}</strong>.
                      {currentEmail.correct ? " That is correct." : " Unfortunately, that is incorrect."}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong className="block mb-1">Security Insight</strong>
                    <p className="text-sm leading-relaxed">
                      {currentEmail.isPhishing
                        ? "This email contained indicators of phishing: unknown sender, urgent language, or suspicious links. Always verify before clicking."
                        : "This was a legitimate email. However, caution is always the best policy. Verifying the sender and context is key."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-right">
                <button
                  className="nav-btn active"
                  onClick={closeEmailFeedback}
                >
                  Continue Training
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-slate-400 py-6">
        © 2025 Security Training Portal • Confidential Training Module
      </footer>
    </div>
  );
}

// --- Component Helpers ---

function NavButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-btn ${active ? "active" : "inactive"}`}
    >
      {children}
    </button>
  );
}

function EmailCard({ email, onDecide }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="email-card">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${open ? 'bg-indigo-500' : 'bg-slate-300'}`}></span>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">{email.from}</div>
          </div>
          <div className="font-bold text-slate-800 text-lg mb-1 truncate leading-tight">{email.subject}</div>
          <div className="text-sm text-slate-500 line-clamp-2">{email.snippet}</div>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-sm font-mono text-slate-600 whitespace-pre-line mb-3">
            {email.body}
          </div>
          <div className="text-xs text-amber-600 flex items-center gap-1 font-medium">
            <span>⚠️</span> External Content - Links Disabled
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <button
          className="flex-1 px-3 py-2 text-sm font-medium border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        >
          {open ? 'Hide Details' : 'Analyze Email'}
        </button>
      </div>

      <div className="mt-3 flex gap-3">
        <button
          className="flex-1 py-2 bg-red-50 text-red-700 font-bold rounded hover:bg-red-600 hover:text-white transition-all border border-red-100"
          onClick={() => onDecide(email.id, true)}
        >
          Report Phishing
        </button>
        <button
          className="flex-1 py-2 bg-green-50 text-green-700 font-bold rounded hover:bg-green-600 hover:text-white transition-all border border-green-100"
          onClick={() => onDecide(email.id, false)}
        >
          Mark as Safe
        </button>
      </div>
    </div>
  );
}

function QuizCard({ questionObj, onAnswer, userAttempts }) {
  if (!questionObj) return <div>No question available.</div>;
  const userAttempt =
    userAttempts && userAttempts.length > 0
      ? userAttempts[userAttempts.length - 1]
      : null;

  return (
    <div className="quiz-container">
      <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">
        Question {questionObj.id.replace('Question ', '')}
      </div>
      <h4 className="text-xl font-bold text-slate-800 mb-6 leading-snug">{questionObj.question}</h4>

      <div className="grid gap-3">
        {questionObj.options.map((opt, i) => {
          const isSelected = userAttempt && userAttempt.chosen === i;
          let btnClass = "quiz-option ";

          if (userAttempt) {
            if (i === questionObj.answerIndex) {
              btnClass += "correct";
            } else if (isSelected && !userAttempt.correct) {
              btnClass += "incorrect";
            } else {
              btnClass += "opacity-50";
            }
          }

          return (
            <button
              key={i}
              className={btnClass}
              onClick={() => onAnswer(i)}
              disabled={!!userAttempt}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {userAttempt && i === questionObj.answerIndex && <span>✅</span>}
                {userAttempt && isSelected && !userAttempt.correct && <span>❌</span>}
              </div>
            </button>
          )
        })}
      </div>

      {userAttempt && (
        <div className={`mt-6 p-4 rounded-lg flex gap-3 animate-fade-in ${userAttempt.correct ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
          }`}>
          <div className="text-2xl">{userAttempt.correct ? "" : "💡"}</div>
          <div>
            <div className="font-bold mb-1">
              {userAttempt.correct ? "That's Correct!" : "Not quite."}
            </div>
            <div className="text-sm opacity-90 leading-relaxed">
              {questionObj.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
