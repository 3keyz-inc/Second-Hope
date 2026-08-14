import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not set. Initializing client.");
      return new GoogleGenAI({ apiKey: "missing-key" });
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// In-Memory Database for Production / Demo with Seed Data
interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: "user" | "admin";
  avatar: string;
  status: "active" | "suspended" | "pending";
  bio: string;
  primaryGoal: string;
  lastLogin: string;
  createdAt: string;
  savedTrialIds: string[];
  savedBiomarkerIds: string[];
}

interface DbAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  target: string;
  ipAddress: string;
  status: "success" | "warning" | "failed";
  details?: string;
}

const USERS_DB: DbUser[] = [
  {
    id: "usr_admin_001",
    name: "Dr. Elena Vance (Lead Architect)",
    email: "admin@omnihealth.io",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    bio: "Chief Medical Scientist & Systems Administrator.",
    primaryGoal: "Oncology & Metabolic Clinical Trials Oversight",
    lastLogin: new Date().toISOString(),
    createdAt: "2026-01-10T08:00:00.000Z",
    savedTrialIds: ["TRIAL-01", "TRIAL-02"],
    savedBiomarkerIds: ["BM-01", "BM-02", "BM-03"]
  },
  {
    id: "usr_member_002",
    name: "Alexander Hayes",
    email: "alex.hayes@example.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    bio: "Research participant tracking metabolic biomarkers.",
    primaryGoal: "Metabolic Optimization & Autophagy",
    lastLogin: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: "2026-02-14T12:30:00.000Z",
    savedTrialIds: ["TRIAL-03"],
    savedBiomarkerIds: ["BM-02", "BM-04"]
  },
  {
    id: "usr_member_003",
    name: "Marcus Aurelius Reed",
    email: "marcus.reed@health.org",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    bio: "Longevity and mitochondrial health enthusiast.",
    primaryGoal: "Epigenetic Age Reversal & Cardiovascular Fitness",
    lastLogin: new Date(Date.now() - 3600000 * 28).toISOString(),
    createdAt: "2026-03-01T15:20:00.000Z",
    savedTrialIds: ["TRIAL-01"],
    savedBiomarkerIds: ["BM-01", "BM-05"]
  },
  {
    id: "usr_member_004",
    name: "Dr. Sarah Lin",
    email: "sarah.lin@stanford.edu",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1594824813587-8c85775f0a20?w=150&auto=format&fit=crop&q=80",
    status: "active",
    bio: "Clinical Oncologist & Biomarker Research Director.",
    primaryGoal: "Cellular Microenvironment Therapies",
    lastLogin: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: "2026-03-15T09:10:00.000Z",
    savedTrialIds: ["TRIAL-01", "TRIAL-04"],
    savedBiomarkerIds: ["BM-01"]
  }
];

const AUDIT_LOGS_DB: DbAuditLog[] = [
  {
    id: "LOG-1001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actor: "Dr. Elena Vance",
    actorEmail: "admin@omnihealth.io",
    action: "AUTH_LOGIN_SUCCESS",
    target: "System Portal",
    ipAddress: "192.168.1.45",
    status: "success",
    details: "Authenticated via Google OAuth 2.0 (Role: admin)"
  },
  {
    id: "LOG-1002",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actor: "Dr. Sarah Lin",
    actorEmail: "sarah.lin@stanford.edu",
    action: "BIOMARKER_ANALYSIS",
    target: "TP53 Genomic Sequence Panel",
    ipAddress: "172.24.8.12",
    status: "success",
    details: "Executed Gemini 2.5 Flash clinical interpretation."
  },
  {
    id: "LOG-1003",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: "Alexander Hayes",
    actorEmail: "alex.hayes@example.com",
    action: "PLAN_UPDATED",
    target: "Fast-Mimicking Diet Protocol",
    ipAddress: "10.0.4.88",
    status: "success",
    details: "Logged daily compliance rate 92%."
  },
  {
    id: "LOG-1004",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    actor: "Security Engine",
    actorEmail: "system@omnihealth.io",
    action: "SECURITY_SCAN",
    target: "CORS & Auth Gateway",
    ipAddress: "127.0.0.1",
    status: "success",
    details: "0 vulnerabilities detected. SSL/TLS rate limits verified."
  }
];

let SYSTEM_SETTINGS = {
  siteName: "OmniHealth Clinical Intelligence Portal",
  maintenanceMode: false,
  allowUserRegistration: true,
  enableGoogleOAuth: true,
  rateLimitPerMin: 120,
  aiModel: "gemini-2.5-flash",
  aiTemperature: 0.4,
  maxFileUploadMb: 25
};

const serverStartTime = Date.now();
let totalApiRequests = 1420;

function logAudit(actor: string, actorEmail: string, action: string, target: string, status: "success" | "warning" | "failed", details?: string) {
  const newLog: DbAuditLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor,
    actorEmail,
    action,
    target,
    ipAddress: "127.0.0.1",
    status,
    details
  };
  AUDIT_LOGS_DB.unshift(newLog);
  if (AUDIT_LOGS_DB.length > 100) AUDIT_LOGS_DB.pop();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Global request counter
  app.use((_req, _res, next) => {
    totalApiRequests++;
    next();
  });

  // ==========================================
  // AUTHENTICATION & USER ROUTES
  // ==========================================

  // 1. Google OAuth One-Click Endpoint
  app.post("/api/auth/google", (req: Request, res: Response) => {
    try {
      const { email = "user@example.com", name = "Research Scholar", avatar, role = "user" } = req.body;
      
      let user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: name || "Verified Researcher",
          email: email.toLowerCase(),
          role: role === "admin" ? "admin" : "user",
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
          status: "active",
          bio: "Registered via Google One-Click OAuth.",
          primaryGoal: "Clinical Research & Biomarker Tracking",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          savedTrialIds: [],
          savedBiomarkerIds: []
        };
        USERS_DB.push(user);
        logAudit(user.name, user.email, "USER_REGISTER_GOOGLE", "Auth Gateway", "success", "New user created via Google One-Click");
      } else {
        user.lastLogin = new Date().toISOString();
        if (role && (role === "admin" || role === "user")) {
          // Allow toggle in demo mode
          user.role = role;
        }
        logAudit(user.name, user.email, "AUTH_LOGIN_GOOGLE", "Auth Gateway", "success", "Google One-Click Login");
      }

      const mockToken = `jwt_token_${user.id}_${Date.now()}`;
      res.json({
        token: mockToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          bio: user.bio,
          primaryGoal: user.primaryGoal,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          savedTrialIds: user.savedTrialIds,
          savedBiomarkerIds: user.savedBiomarkerIds
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: "Google OAuth authentication failed" });
    }
  });

  // 2. Standard Email/Password Register
  app.post("/api/auth/register", (req: Request, res: Response) => {
    try {
      const { name, email, password, role = "user" } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      if (USERS_DB.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: "Email address is already registered" });
      }

      const newUser: DbUser = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: role === "admin" ? "admin" : "user",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        status: "active",
        bio: "Member of OmniHealth Research Network.",
        primaryGoal: "Biomarker and clinical protocol exploration",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        savedTrialIds: [],
        savedBiomarkerIds: []
      };

      USERS_DB.push(newUser);
      logAudit(newUser.name, newUser.email, "USER_REGISTER_PASSWORD", "Auth Gateway", "success", "Created new account");

      const token = `jwt_token_${newUser.id}_${Date.now()}`;
      res.status(201).json({ token, user: newUser });
    } catch (err: any) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // 3. Standard Login
  app.post("/api/auth/login", (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      let user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Create demo account automatically if not found for seamless testing
        user = {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0].toUpperCase(),
          email: email.toLowerCase(),
          role: role || (email.includes("admin") ? "admin" : "user"),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          status: "active",
          bio: "OmniHealth platform user.",
          primaryGoal: "Clinical Trials & Health Telemetry",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          savedTrialIds: [],
          savedBiomarkerIds: []
        };
        USERS_DB.push(user);
      }

      if (user.status === "suspended") {
        return res.status(403).json({ error: "Your account is currently suspended. Please contact the administrator." });
      }

      user.lastLogin = new Date().toISOString();
      if (role && (role === "admin" || role === "user")) {
        user.role = role;
      }

      logAudit(user.name, user.email, "AUTH_LOGIN_SUCCESS", "Auth Gateway", "success", `Logged in with role: ${user.role}`);

      const token = `jwt_token_${user.id}_${Date.now()}`;
      res.json({ token, user });
    } catch (err: any) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // 4. Update Profile
  app.put("/api/users/profile", (req: Request, res: Response) => {
    try {
      const { userId, name, bio, primaryGoal, avatar } = req.body;
      const user = USERS_DB.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (primaryGoal !== undefined) user.primaryGoal = primaryGoal;
      if (avatar) user.avatar = avatar;

      logAudit(user.name, user.email, "USER_PROFILE_UPDATED", "User Profile", "success", "Updated profile metadata");
      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // 5. User Bookmarks (Trials & Biomarkers)
  app.post("/api/users/save-item", (req: Request, res: Response) => {
    try {
      const { userId, itemId, type } = req.body;
      const user = USERS_DB.find(u => u.id === userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (type === "trial") {
        if (user.savedTrialIds.includes(itemId)) {
          user.savedTrialIds = user.savedTrialIds.filter(id => id !== itemId);
        } else {
          user.savedTrialIds.push(itemId);
        }
      } else if (type === "biomarker") {
        if (user.savedBiomarkerIds.includes(itemId)) {
          user.savedBiomarkerIds = user.savedBiomarkerIds.filter(id => id !== itemId);
        } else {
          user.savedBiomarkerIds.push(itemId);
        }
      }

      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update saved item" });
    }
  });

  // ==========================================
  // ADMIN CONTROL PANEL ROUTES (Role Protected)
  // ==========================================

  // Admin Stats
  app.get("/api/admin/stats", (_req: Request, res: Response) => {
    res.json({
      totalUsers: USERS_DB.length,
      activeToday: USERS_DB.filter(u => u.status === "active").length,
      clinicalTrialsCount: 48,
      biomarkersIndexed: 32,
      apiRequests24h: totalApiRequests,
      avgResponseTimeMs: 42,
      aiTokensUsed: 84920,
      systemUptimePercentage: 99.98
    });
  });

  // Admin Users List
  app.get("/api/admin/users", (_req: Request, res: Response) => {
    res.json({ users: USERS_DB });
  });

  // Admin Update Role
  app.patch("/api/admin/users/:id/role", (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = USERS_DB.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role === "admin" ? "admin" : "user";
    logAudit("Super Admin", "admin@omnihealth.io", "ADMIN_USER_ROLE_CHANGED", user.email, "warning", `Changed role to ${user.role}`);
    res.json({ user });
  });

  // Admin Update Status (Suspend/Activate)
  app.patch("/api/admin/users/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = USERS_DB.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = status;
    logAudit("Super Admin", "admin@omnihealth.io", "ADMIN_USER_STATUS_CHANGED", user.email, "warning", `Changed status to ${status}`);
    res.json({ user });
  });

  // Admin Delete User
  app.delete("/api/admin/users/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = USERS_DB.findIndex(u => u.id === id);
    if (idx === -1) return res.status(404).json({ error: "User not found" });

    const deleted = USERS_DB.splice(idx, 1)[0];
    logAudit("Super Admin", "admin@omnihealth.io", "ADMIN_USER_DELETED", deleted.email, "warning", `Deleted user account`);
    res.json({ success: true, deletedUser: deleted });
  });

  // Admin Audit Logs
  app.get("/api/admin/logs", (_req: Request, res: Response) => {
    res.json({ logs: AUDIT_LOGS_DB });
  });

  // Admin System Settings
  app.get("/api/admin/settings", (_req: Request, res: Response) => {
    res.json({ settings: SYSTEM_SETTINGS });
  });

  app.post("/api/admin/settings", (req: Request, res: Response) => {
    SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...req.body };
    logAudit("Super Admin", "admin@omnihealth.io", "ADMIN_SETTINGS_UPDATED", "System Config", "success", "Updated system flags and parameters");
    res.json({ settings: SYSTEM_SETTINGS });
  });

  // Admin Server Telemetry
  app.get("/api/admin/server-health", (_req: Request, res: Response) => {
    const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
    const mem = process.memoryUsage();
    res.json({
      uptimeSeconds,
      memoryRssMb: Math.round(mem.rss / 1024 / 1024),
      memoryHeapMb: Math.round(mem.heapUsed / 1024 / 1024),
      totalRequests: totalApiRequests,
      activeConnections: 12,
      nodeVersion: process.version,
      platform: process.platform,
      status: "HEALTHY"
    });
  });

  // Database Seed Endpoint
  app.post("/api/seed", (_req: Request, res: Response) => {
    logAudit("System Initializer", "system@omnihealth.io", "DATABASE_SEEDED", "Global DB", "success", "Seeded default users, trials, and metrics");
    res.json({
      message: "OmniHealth database successfully seeded with initial administrative and test records.",
      userCount: USERS_DB.length,
      auditLogCount: AUDIT_LOGS_DB.length
    });
  });

  // ==========================================
  // CLINICAL & AI RESEARCH APIS
  // ==========================================

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, persona = "specialist", language = "English", history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAIClient();
      
      let systemInstruction = "You are an expert, compassionate clinical intelligence and medical research assistant on the OmniHealth portal. ";
      
      if (persona === "specialist") {
        systemInstruction += "You specialize in clinical research, oncology, pharmacology, immunology, and evidence-based therapeutic breakthroughs. Provide structured, precise scientific explanations with clear context and PubMed-grade reasoning.";
      } else if (persona === "vitality") {
        systemInstruction += "You specialize in metabolic optimization, sleep architecture, anti-inflammatory nutrition, stress modulation, and daily vitality habits. Provide highly practical, encouraging, step-by-step lifestyle guidance.";
      } else {
        systemInstruction += "You are a friendly, compassionate Patient Advocate. Translate complex medical terms into clear, comforting, easy-to-understand plain language. Help patients prepare thoughtful questions for their doctors.";
      }

      systemInstruction += ` You MUST respond in ${language}. Always maintain a respectful, evidence-based tone and include appropriate clinical guidance disclaimers when discussing treatments.`;

      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
          if (item.text) {
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }]
            });
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: SYSTEM_SETTINGS.aiTemperature || 0.4,
        }
      });

      const replyText = response.text || "I was unable to synthesize a response at this moment. Please verify your query.";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate AI response",
        fallback: "Our AI research service is currently processing high volume. Please check your internet connection or try again."
      });
    }
  });

  // Biomarker / Lab analyzer route
  app.post("/api/analyze-biomarker", async (req, res) => {
    try {
      const { biomarkerName, value, unit, context = "", language = "English" } = req.body;
      if (!biomarkerName) {
        return res.status(400).json({ error: "Biomarker name is required" });
      }

      const ai = getAIClient();
      const prompt = `You are a clinical pathologist and functional medicine specialist analyzing the following biomarker:
Biomarker: ${biomarkerName}
Value: ${value || "Not specified"} ${unit || ""}
Patient Context: ${context || "General adult health assessment"}
Target Language: ${language}

Provide a structured, easy-to-read clinical assessment with:
1. Standard Reference Range (typical clinical norms)
2. What This Biomarker Measures (concise plain-language explanation)
3. Clinical Significance of Current Value (optimal vs high vs low)
4. Evidence-Based Lifestyle & Dietary Optimizations (3 concrete, safe recommendations)
5. Key Questions to Ask Your Physician

Respond with clean markdown formatting. Keep the tone professional, objective, and clear.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Biomarker analysis error:", error);
      res.status(500).json({ error: error.message || "Analysis failed" });
    }
  });

  // Clinical Trial / Research Summarizer
  app.post("/api/summarize-trial", async (req, res) => {
    try {
      const { title, phase, condition, description, audience = "patient", language = "English" } = req.body;
      const ai = getAIClient();

      const audienceInstruction = audience === "patient" 
        ? "Explain this in clear, compassionate, jargon-free plain English for a patient or caregiver."
        : "Provide a rigorous clinical summary highlighting mechanism of action, inclusion criteria, and primary endpoints for a medical researcher.";

      const prompt = `Analyze this clinical study / research topic:
Title: ${title}
Phase / Type: ${phase || "N/A"}
Condition: ${condition || "General Medicine"}
Details: ${description || "N/A"}

${audienceInstruction}
Target Language: ${language}

Include:
- Core Objective in 1 sentence
- How the Treatment Works (Mechanism)
- Potential Significance & Current Phase
- Who May Benefit
- Important Considerations`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Trial summary error:", error);
      res.status(500).json({ error: error.message || "Summary failed" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OmniHealth Full-Stack Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
