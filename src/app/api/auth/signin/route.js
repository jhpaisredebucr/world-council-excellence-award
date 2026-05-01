import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";
import { nanoid } from "nanoid";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const users = await query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status === "pending") {
      return NextResponse.json(
        { success: false, message: "Still waiting for approval" },
        { status: 403 }
      );
    }

    if (user.status === "banned") {
      return NextResponse.json(
        { success: false, message: "Your account was banned" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ─── Create JWT with unique jti to prevent session fixation ─────────────
    const jti = nanoid(16);

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      role: user.role,
      referral_code: user.referral_code,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setJti(jti)          // unique ID for this session — helps with token revocation
      .setIssuedAt()
      .setExpirationTime("2d")
      .sign(secret);

    const res = NextResponse.json({
      success: true,
      message: "Successfully logged in",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        referral_code: user.referral_code
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",  // CSRF protection
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    });

    return res;

  } catch (err) {
    console.error("SignIn error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}