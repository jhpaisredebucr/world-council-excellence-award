import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
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
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const role = decoded.role;

    // Only allow admins to access all transactions
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized (admin only)" },
        { status: 403 }
      );
    }

    // Fetch all transactions without pagination for CSV download
    const transactions = await query(
      `SELECT id, user_id, amount, type, status, created_at, payment_method, reference_number
       FROM transactions
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      transactions
    });

  } catch (err) {
    console.error("All Transactions API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error"
      },
      { status: 500 }
    );
  }
}
