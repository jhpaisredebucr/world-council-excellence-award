import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

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

    const body = await req.json();
    const { user_id, cart } = body;

    if (!user_id || !cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const insertedOrders = [];

    // ----------------------------
    // INSERT ORDERS + CALCULATE TOTAL
    // ----------------------------
    for (const item of cart) {
      const package_id = item.package_id;
      const quantity = item.quantity || 1;
      const price = Number(item.price) || 0;

      totalAmount += price * quantity;

      const result = await query(
        `
        INSERT INTO orders (user_id, package_id, quantity, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
        `,
        [user_id, package_id, quantity]
      );

      insertedOrders.push(result[0]);
    }

    // ----------------------------
    // INSERT TRANSACTION (linked to first order)
    // ----------------------------
    const firstOrderId = insertedOrders[0].id;
    const transactionResult = await query(
      `
      INSERT INTO transactions (user_id, order_id, type, amount, status)
      VALUES ($1, $2, 'package_purchase', $3, 'pending')
      RETURNING *
      `,
      [user_id, firstOrderId, totalAmount]
    );

    return NextResponse.json({
      success: true,
      orders: insertedOrders,
      transaction: transactionResult[0],
      total: totalAmount
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
