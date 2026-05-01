import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Shared secret encoder
const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

// ─── Middleware: require authenticated user ───────────────────────────────────
export async function requireAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized (no token)" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return decoded; // null if failed, decoded object if ok
}

// ─── Middleware: require admin role ──────────────────────────────────────────
export async function requireAdmin(req) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult; // already a response

  if (authResult.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden (admin required)" },
      { status: 403 }
    );
  }

  return authResult;
}

// ─── Standalone: verify a token string (no req needed) ───────────────────────
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ─── Standalone: create a signed JWT ─────────────────────────────────────────
export function signToken(payload, expiresIn = "2d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

// ─── Re-export SignJWT for signin route ───────────────────────────────────────
export { SignJWT } from "jose";