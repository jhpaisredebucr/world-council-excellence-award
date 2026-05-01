import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, cart, walletType = "balance" } = body;

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
      const product_id = item.product_id;
      const quantity = item.quantity || 1;
      const price = Number(item.price) || 0;

      totalAmount += price * quantity;

      const result = await query(
        `
        INSERT INTO orders (user_id, product_id, quantity, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
        `,
        [user_id, product_id, quantity]
      );

      insertedOrders.push(result[0]);
    }

    // ----------------------------
    // DEDUCT FROM SELECTED WALLET
    // ----------------------------
    let walletColumn;
    switch (walletType) {
      case "pc_credit":
        walletColumn = "pc_credit";
        break;
      case "ppv_credit":
        walletColumn = "ppv_credit";
        break;
      case "balance":
      default:
        walletColumn = "balance";
        break;
    }

// Check user's balance before deduction
    const userCheck = await query(
      `SELECT ${walletColumn} AS balance FROM users WHERE id = $1`,
      [user_id]
    );

    if (!userCheck.length || Number(userCheck[0].balance) < totalAmount) {
      return NextResponse.json(
        { message: `Insufficient ${walletColumn} balance` },
        { status: 400 }
      );
    }

    // Deduct from the selected wallet
    await query(
      `
        UPDATE users
        SET ${walletColumn} = ${walletColumn} - $1
        WHERE id = $2;
      `, [totalAmount, user_id]
    );

// ----------------------------
    // INSERT TRANSACTION (linked to first order)
    //Status changed to 'approved' since balance is deducted immediately
    // ----------------------------
    const firstOrderId = insertedOrders[0].id;
    const transactionResult = await query(
      `
      INSERT INTO transactions (user_id, order_id, type, amount, status)
      VALUES ($1, $2, 'purchase', $3, 'approved')
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