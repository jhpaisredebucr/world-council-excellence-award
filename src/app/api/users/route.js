import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId"); // Optional: fetch specific user by ID (for admin)
    const listUsers = searchParams.get("list"); // Optional: list all users (for admin)

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const isAdmin = decoded.role === "admin";

    // If admin requests list all users, return users with their profile data
    if (listUsers === "true" && isAdmin) {
      const usersRes = await query(
        `SELECT u.id, u.username, u.referral_code, u.referred_by, u.role, u.created_at, u.status, u.package,
                p.first_name, p.middle_name, p.last_name,
                c.email, c.contact_no
         FROM users u
         LEFT JOIN user_profiles p ON p.user_id = u.id
         LEFT JOIN user_contacts c ON c.user_id = u.id
         ORDER BY u.created_at DESC`
      );

      return NextResponse.json({
        success: true,
        users: usersRes
      });
    }

    // If userId is provided and requester is admin, fetch that user; otherwise fetch self
    let userID = decoded.id;
    
    if (targetUserId && isAdmin) {
      userID = parseInt(targetUserId, 10);
    }

    // -----------------------
    // 1. MAIN USER
    // -----------------------
    const userRes = await query(
      `SELECT id, username, referral_code, referred_by, role, created_at, status, package FROM users WHERE id = $1`,
      [userID]
    );

    if (!userRes.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = userRes[0];

    // -----------------------
    // 2. PROFILE
    // -----------------------
    const profileRes = await query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 3. CONTACTS
    // -----------------------
    const contactRes = await query(
      `SELECT * FROM user_contacts WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 4. ADDRESS
    // -----------------------
    const addressRes = await query(
      `SELECT * FROM user_addresses WHERE user_id = $1`,
      [userID]
    );

    // -----------------------
    // 5. REFERRED USER (optional)
    // -----------------------
    let referredBy = null;

    if (user.referred_by) {
      const ref = await query(
        `SELECT id, username, referral_code FROM users WHERE referral_code = $1`,
        [user.referred_by]
      );

      referredBy = ref[0] || null;
    }

    // -----------------------
    // FINAL RESPONSE
    // -----------------------
    return NextResponse.json({
      success: true,

      userInfo: user,
      profile: profileRes[0] || null,
      contacts: contactRes[0] || null,
      address: addressRes[0] || null,
      referredBy
    });

  } catch (err) {
    console.error("Error fetching user:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}