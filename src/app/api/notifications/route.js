import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
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

    const userID = decoded.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countRes = await query(
      "SELECT COUNT(*) as total FROM notifications WHERE user_id = $1",
      [userID]
    );

    // Get notifications with pagination
    const notificationsRes = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userID, limit, offset]
    );

    return NextResponse.json({
      success: true,
      notifications: notificationsRes,
      pagination: {
        page,
        limit,
        total: parseInt(countRes[0].total),
        totalPages: Math.ceil(countRes[0].total / limit)
      }
    });

  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
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

    const userID = decoded.id;
    const { title, message, type = "info" } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [userID, title, message, type]
    );

    return NextResponse.json({
      success: true,
      notification: result[0]
    });

  } catch (err) {
    console.error("Error creating notification:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
