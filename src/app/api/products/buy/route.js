import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAuth(req);
    if (decoded instanceof NextResponse) return decoded;

    const userID = decoded.id;

    const body = await req.json();
    const { cart, walletType = "balance" } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request — cart required" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const insertedOrders = [];

    // ─── Validate products & calculate total ─────────────────────────────
    for (const item of cart) {
      const product_id = Number(item.product_id);
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;

      if (!product_id || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid cart item" },
          { status: 400 }
        );
      }

      totalAmount += price * quantity;

      const result = await query(
        `INSERT INTO orders (user_id, product_id, quantity, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING *`,
        [userID, product_id, quantity]
      );

      insertedOrders.push(result[0]);
    }

    // ─── Create transaction record for admin approval (status = pending) ────
    // Balance will be deducted only when admin approves the order
    const firstOrderId = insertedOrders[0].id;
    const transactionResult = await query(
      `INSERT INTO transactions (user_id, order_id, type, amount, status)
       VALUES ($1, $2, 'purchase', $3, 'pending')
       RETURNING *`,
      [userID, firstOrderId, totalAmount]
    );

    return NextResponse.json({
      success: true,
      orders: insertedOrders,
      transaction: transactionResult[0],
      total: totalAmount,
    });

  } catch (err) {
    console.error("[products/buy] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
