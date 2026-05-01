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
    const { cart } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request — cart required" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const insertedOrders = [];

    // ─── Validate packages & calculate total ──────────────────────────────
    for (const item of cart) {
      const package_id = Number(item.package_id);
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;

      if (!package_id || price <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid cart item" },
          { status: 400 }
        );
      }

      totalAmount += price * quantity;

      const result = await query(
        `INSERT INTO orders (user_id, package_id, quantity, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING *`,
        [userID, package_id, quantity]
      );

      insertedOrders.push(result[0]);
    }

    // ─── Balance check + deduction (atomic via transaction) ───────────────
    await query("BEGIN");

    try {
      const userCheck = await query(
        `SELECT balance FROM users WHERE id = $1 FOR UPDATE`,
        [userID]
      );

      if (!userCheck.length || Number(userCheck[0].balance) < totalAmount) {
        await query("ROLLBACK");
        return NextResponse.json(
          { success: false, message: `Insufficient balance` },
          { status: 400 }
        );
      }

      await query(
        `UPDATE users SET balance = balance - $1 WHERE id = $2`,
        [totalAmount, userID]
      );

      // ─── Insert transaction ──────────────────────────────────────────────
      const firstOrderId = insertedOrders[0].id;
      const transactionResult = await query(
        `INSERT INTO transactions (user_id, order_id, type, amount, status)
         VALUES ($1, $2, 'package_purchase', $3, 'pending')
         RETURNING *`,
        [userID, firstOrderId, totalAmount]
      );

      await query("COMMIT");

      return NextResponse.json({
        success: true,
        orders: insertedOrders,
        transaction: transactionResult[0],
        total: totalAmount,
      });

    } catch (innerError) {
      await query("ROLLBACK");
      throw innerError;
    }

  } catch (err) {
    console.error("[packages/buy] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}