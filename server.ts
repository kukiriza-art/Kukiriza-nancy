import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Database } from "./server/database";
import { signToken, verifyToken } from "./server/session";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to parse cookie string
function parseCookies(cookieHeader?: string): { [key: string]: string } {
  const cookies: { [key: string]: string } = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
  });
  return cookies;
}

// Helper to determine APP base URL securely
function getAppUrl(req: express.Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const host = req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  return `${protocol}://${host}`;
}

// Custom session and auth middleware
app.use((req: any, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["session_token"];
  if (token) {
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
});


// Lazy-initialize Gemini API client to prevent startup crashes when the API key is missing
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in Settings > Secrets inside the build workspace.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// PWA routes served directly from server for maximum durability
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(process.cwd(), "manifest.json"));
});

app.get("/sw.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`
    const CACHE_NAME = "pos-cache-v1";
    self.addEventListener("install", (e) => {
      self.skipWaiting();
    });
    self.addEventListener("activate", (e) => {
      e.waitUntil(clients.claim());
    });
    self.addEventListener("fetch", (e) => {
      e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
      );
    });
  `);
});

// AI Copilot Integration route
app.post("/api/copilot", async (req, res) => {
  try {
    const { 
      prompt, 
      activePage, 
      state,
      todayTab,
      weekTab,
      monthTab,
      selectedProjectId,
      projectTab,
      selectedDate
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAI();

    const currentSubcontext = `Active Planner View Subcontext:
- Selected Day date: July ${selectedDate || 1}, 2026
- Today Workspace current active sub-tab: "${todayTab || 'overview'}"
- Week Workspace active tab: "${weekTab || 'overview'}"
- Month Workspace active tab: "${monthTab || 'overview'}"
- Selected Project index in portfolio: ${selectedProjectId !== null && selectedProjectId !== undefined ? selectedProjectId : 'None'}
- Selected Project active sub-tab: "${projectTab || 'overview'}"
`;

    const systemInstruction = `You are a high-performance productivity consultant and personal alignment strategist (Personal OS AI Copilot).
Your goal is to optimize the active planner page's content based on the user's natural language requests.
Analyze the user request, the active page type, and the current planner state, and return both a friendly markdown message explaining your changes/suggestions, and the modified planner state properties.

Here is the key layout mapping of state properties you can modify:
1. "annualGoals": Array of objects: { pillar: string, milestone: string, progress: number } (progress is 0 to 100).
2. "projects": Array of objects: { name: string, status: 'In Progress'|'Planning'|'Completed'|'Blocked', due: string, pct: number }
3. "dailyTasks": Array of objects for hourly timeline: { time: string, text: string } (time slots from 6AM to 10PM).
4. "yearScores": Object with numeric ratings (0-100) for categories: productivity, happiness, health, financial, relationships, growth, fun, environment.
5. "customTexts": A key-value dictionary of custom text strings representing text entries on planner pages:
   - For Quarterly Plan (activePage.q):
     * "q_\${q}_objective": main quarter goal
     * "q_\${q}_kr_0", "q_\${q}_kr_1", "q_\${q}_kr_2": three Key Results
     * "q_\${q}_tactics": Q actions/tactics text
     * "q_\${q}_review": quarterly review matrix
   - For Calendar Horizon priority focus:
     * "calendar_focus_\${activePage.id}_0" to "3" (one for each month displayed on the active page)
   - For Monthly Dashboard parameters:
     * "month_\${activePage.num}_revenue": revenue target (e.g. "$12,000")
     * "month_\${activePage.num}_savings": savings ratio (e.g. "35%")
     * "month_\${activePage.num}_work": deep work focus hours (e.g. "80 Hrs")
     * "month_\${activePage.num}_workouts": training sessions (e.g. "20 Sessions")
   - For Weekly Roadmap:
     * "weekly_day_focus_0" (Monday) to "6" (Sunday): core note/focus at the bottom of the column
   - For Daily Command Center:
     * "daily_gratitude": morning appreciation list
     * "daily_metric": success metric for the day
     * "daily_notes": unstructured notes for the day
     * "daily_sleep", "daily_water", "daily_energy", "daily_focus", "daily_mission": metrics and mission statements for the day
     * "daily_act_1", "daily_act_2", "daily_act_3": critical daily action titles
     * "daily_act_1_done", "daily_act_2_done", "daily_act_3_done": critical daily action checkoff (values 'true' or 'false')
   - For Project Portfolio Audit:
     * "audit_blockades": root cause of blockades
     * "audit_mitigation": corrective actions plan
   - For Lessons & Reflections:
     * "lessons_intentions": core commitments
     * "lessons_challenges": biggest annual hurdle

Rules:
- Act strictly upon the active page context: "${activePage.title}" (Type: "${activePage.type}").
- Make your content highly practical, clean, professional, and clear. Avoid placeholders or lazy ellipses.
- In "message", briefly outline the rationale behind your structured edits and how it improves focus. Do not mention technical code keys or internal state keys in the message. Speak in a helpful tone.
- In "updatedState", only provide fields that need to be changed or filled. Preserve other values or keep them unchanged unless requested.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          text: `Active Page: ${JSON.stringify(activePage)}
${currentSubcontext}
Current State: ${JSON.stringify(state)}
User Request: "${prompt}"`
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: "The professional assistant response text in markdown format summarizing the modifications and strategies."
            },
            updatedState: {
              type: Type.OBJECT,
              description: "The state fields that were updated. Any provided fields will be merged with the current state.",
              properties: {
                annualGoals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pillar: { type: Type.STRING },
                      milestone: { type: Type.STRING },
                      progress: { type: Type.INTEGER }
                    }
                  }
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      status: { type: Type.STRING },
                      due: { type: Type.STRING },
                      pct: { type: Type.INTEGER }
                    }
                  }
                },
                dailyTasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      text: { type: Type.STRING }
                    }
                  }
                },
                yearScores: {
                  type: Type.OBJECT,
                  properties: {
                    productivity: { type: Type.INTEGER },
                    happiness: { type: Type.INTEGER },
                    health: { type: Type.INTEGER },
                    financial: { type: Type.INTEGER },
                    relationships: { type: Type.INTEGER },
                    growth: { type: Type.INTEGER },
                    fun: { type: Type.INTEGER },
                    environment: { type: Type.INTEGER }
                  }
                },
                customTexts: {
                  type: Type.OBJECT,
                  description: "Updates to specific text key configurations on any of the A5 planner slides."
                }
              }
            }
          },
          required: ["message", "updatedState"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text returned from Gemini API");
    }

    const data = JSON.parse(resultText.trim());
    res.json(data);

  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    res.status(500).json({ error: error.message || "Failed to process Copilot request" });
  }
});

// ============================================================================
// GOOGLE OAUTH 2.0 & USER RETRIEVAL ROUTES
// ============================================================================

// 0. Check OAuth Configuration Status
app.get("/api/auth/config", (req, res) => {
  res.json({
    configured: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdPresent: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretPresent: !!process.env.GOOGLE_CLIENT_SECRET,
  });
});

// 1. Get the Google OAuth Authorization URL
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({
      error: "GOOGLE_CLIENT_ID is not configured on the server. Please add it to Settings > Secrets."
    });
  }

  const redirectUri = `${getAppUrl(req)}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent"
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl });
});

// 2. Google OAuth Callback (Exchanges code, upserts user profile, issues cookie, closes popup)
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code is missing");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send("Google OAuth GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured on the server.");
  }

  try {
    const redirectUri = `${getAppUrl(req)}/auth/callback`;

    // Exchange auth code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      throw new Error(`Google token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Fetch user info using the access token
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const profile = await userInfoResponse.json();

    // Upsert the user profile in our local persistent JSON-file database
    const user = Database.upsertUser({
      google_id: profile.id,
      email: profile.email,
      display_name: profile.name,
      avatar_url: profile.picture
    });

    // Generate custom signed cryptographic session token
    const sessionToken = signToken({
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url
    });

    // Issue standard cookie with SafeSite=None and Secure for iframe contexts
    res.setHeader(
      "Set-Cookie",
      `session_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000`
    );

    // Render postMessage HTML page to close the popup and trigger reload on caller tab
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #121316; color: #fff; text-align: center; padding: 50px;">
          <h2 style="color: #10B981; margin-bottom: 10px;">Sign In Successful</h2>
          <p style="color: #9CA3AF; font-size: 14px;">Closing this window and syncing your planner...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
});

// 3. Get currently authenticated session user profile
app.get("/api/auth/me", (req: any, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 4. Logout (Clears session cookie)
app.post("/api/auth/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "session_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0"
  );
  res.json({ success: true });
});

// Vite server middleware or static assets serving
async function initializeVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initializeVite();
