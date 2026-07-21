import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "NancyPlannerPersonalOSDefaultSecret_2026";

export function signToken(payload: any): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64");
  return `${data}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("base64");
    if (signature !== expectedSignature) return null;
    return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
  } catch (e) {
    return null;
  }
}
