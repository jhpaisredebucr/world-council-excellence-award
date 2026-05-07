import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { applyRateLimit, adminRateLimit, getUserIdFromRequest } from "@/lib/rateLimit";

export async function PATCH(req) {
  try {
    // Apply rate limiting for admin endpoints
    const rateLimitUserId = await getUserIdFromRequest(req);
    const rateLimitResult = await applyRateLimit(req, adminRateLimit, rateLimitUserId);
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { success: false, message: "Too many admin requests. Please try again later." },
        { status: 429 }
      );
      
      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const userIdNum = Number(userId);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // ─── 1. Approve user & get referral code ────────────────────────────────
    const updated = await query(
      `UPDATE users
       SET status = $1
       WHERE id = $2
       RETURNING id, referred_by, package`,
      ["approved", userIdNum]
    );

    if (!updated.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = updated[0];
    let referrerId = null;

    // ─── 2. Find referrer ID from referral code ──────────────────────────────
    if (user.referred_by) {
      const referrer = await query(
        `SELECT id FROM users WHERE referral_code = $1 LIMIT 1`,
        [user.referred_by]
      );
      referrerId = referrer[0]?.id || null;
    }

    // ─── 3. Approve the corresponding pending plan transaction ──────────────
    // Transaction type is stored based on the user's package (e.g. 'plan', 'package_purchase')
    // Use a fallback of 'plan' for legacy compatibility
    const planType = "plan";

    const txResult = await query(
      `UPDATE transactions
       SET status = 'approved'
       WHERE user_id = $1
         AND status = 'pending'
         AND type = $2
       RETURNING id`,
      [userIdNum, planType]
    );

    const response = NextResponse.json({
      success: true,
      message: "User approved successfully",
      userId: user.id,
      referredByCode: user.referred_by,
      referrerId,
      transactionApproved: txResult.length > 0,
    });

    // Add rate limit headers to successful response
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error("[portal/admin/members] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}