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

    // ─── Determine wallet column ──────────────────────────────────────────
    let walletColumn;
    switch (walletType) {
      case "pc_credit":   walletColumn = "pc_credit";   break;
      case "ppv_credit":  walletColumn = "ppv_credit";  break;
      case "balance":
      default:            walletColumn = "balance";     break;
    }

    // ─── Balance check + deduction (atomic via transaction) ───────────────
    await query("BEGIN");

    try {
      const userCheck = await query(
        `SELECT ${walletColumn} AS balance FROM users WHERE id = $1 FOR UPDATE`,
        [userID]
      );

      if (!userCheck.length || Number(userCheck[0].balance) < totalAmount) {
        await query("ROLLBACK");
        return NextResponse.json(
          { success: false, message: `Insufficient ${walletColumn} balance` },
          { status: 400 }
        );
      }

      await query(
        `UPDATE users SET ${walletColumn} = ${walletColumn} - $1 WHERE id = $2`,
        [totalAmount, userID]
      );

      // ─── Insert transaction ──────────────────────────────────────────────
      const firstOrderId = insertedOrders[0].id;
      const transactionResult = await query(
        `INSERT INTO transactions (user_id, order_id, type, amount, status)
         VALUES ($1, $2, 'purchase', $3, 'approved')
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
    console.error("[products/buy] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}