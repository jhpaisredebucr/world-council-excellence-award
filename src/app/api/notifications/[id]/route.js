import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
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
    const notificationId = params.id;
    
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Error parsing request body:", err);
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }
    
    const { title, message, type, read } = body;
    
    console.log(`Mark as read request - UserID: ${userID}, NotificationID: ${notificationId}, Read: ${read}`);

    // Check if notification belongs to user
    let checkRes;
    try {
      checkRes = await query(
        "SELECT id FROM notifications WHERE id = $1 AND user_id = $2",
        [notificationId, userID]
      );
      console.log(`Notification check result: ${checkRes.length} records found`);
    } catch (err) {
      console.error("Error checking notification ownership:", err);
      return NextResponse.json(
        { success: false, message: "Database error checking notification" },
        { status: 500 }
      );
    }

    if (!checkRes.length) {
      console.log(`Notification not found for user ${userID}, notification ${notificationId}`);
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (message !== undefined) {
      updateFields.push(`message = $${paramIndex++}`);
      updateValues.push(message);
    }
    if (type !== undefined) {
      updateFields.push(`type = $${paramIndex++}`);
      updateValues.push(type);
    }
    if (read !== undefined) {
      updateFields.push(`read = $${paramIndex++}`);
      updateValues.push(read);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(notificationId, userID);

    const updateQuery = `UPDATE notifications 
                       SET ${updateFields.join(", ")} 
                       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} 
                       RETURNING *`;
    
    console.log(`Update query: ${updateQuery}`);
    console.log(`Update values: ${JSON.stringify(updateValues)}`);

    let result;
    try {
      result = await query(updateQuery, updateValues);
      console.log(`Update result: ${result.length} records updated`);
    } catch (err) {
      console.error("Error updating notification:", err);
      return NextResponse.json(
        { success: false, message: "Database error updating notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: result[0]
    });

  } catch (err) {
    console.error("Error updating notification:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
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
    const notificationId = params.id;

    // Check if notification belongs to user and delete it
    const result = await query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *",
      [notificationId, userID]
    );

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (err) {
    console.error("Error deleting notification:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
