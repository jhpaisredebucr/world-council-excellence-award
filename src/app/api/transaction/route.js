import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized (no token)" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userID = decoded.id;
    const role = decoded.role;

    let transactions;

    // Safe explicit columns
    const baseSelect = "SELECT id, user_id, amount, type, status, created_at, payment_method, reference_number FROM transactions";

    if (role === "admin") {
      transactions = await query(
        `${baseSelect} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    } else {
      transactions = await query(
        `${baseSelect} WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userID, limit, offset]
      );
    }

    // Count total
    let totalCountQuery, totalCountParams;
    if (role === "admin") {
      totalCountQuery = "SELECT COUNT(*) FROM transactions";
      totalCountParams = [];
    } else {
      totalCountQuery = "SELECT COUNT(*) FROM transactions WHERE user_id = $1";
      totalCountParams = [userID];
    }
    const totalResult = await query(totalCountQuery, totalCountParams);
    const total = Number(totalResult[0].count);

    return NextResponse.json({
      success: true,
      transactions,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" }
    });

  } catch (err) {
    console.error("Transaction API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error"
      },
      { status: 500 }
    );
  }
}
