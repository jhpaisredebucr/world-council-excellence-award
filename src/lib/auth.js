import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// ─── Middleware: require authenticated user ───────────────────────────────────
export async function requireAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized (no token)" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("[requireAuth] JWT verify error:", err.message);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// ─── Middleware: require admin role ──────────────────────────────────────────
export async function requireAdmin(req) {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;

  if (result.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden (admin required)" },
      { status: 403 }
    );
  }

  return result;
}

// ─── Standalone: verify a token string ───────────────────────────────────────
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ─── Standalone: create a signed JWT (uses jsonwebtoken, not jose) ─────────────
export function signToken(payload, expiresIn = "2d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}