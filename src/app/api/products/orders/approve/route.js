import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req) {
  try {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const decoded = await requireAdmin(req);
    if (decoded instanceof NextResponse) return decoded;

    const body = await req.json();
    const { orderId, action = "approve" } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const orderIdNum = Number(orderId);
    if (!Number.isInteger(orderIdNum) || orderIdNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

// Fetch order details
    const orderResult = await query(
      `SELECT o.*, u.balance, u.pc_credit, u.ppv_credit, t.amount as tx_amount, t.id as transaction_id
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN transactions t ON t.order_id = o.id
       WHERE o.id = $1`,
      [orderIdNum]
    );

    if (!orderResult.length) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Check if order is already processed
    if (order.status !== "pending") {
      return NextResponse.json(
        { success: false, message: `Order is already ${order.status}` },
        { status: 400 }
      );
    }

// Handle approve action
    if (action === "approve") {
      const amount = Number(order.tx_amount) || 0;
      const walletColumn = order.wallet_type;

      // Start transaction
      await query("BEGIN");

      try {
        // Check balance
        const userCheck = await query(
          `SELECT ${walletColumn} AS balance FROM users WHERE id = $1 FOR UPDATE`,
          [order.user_id]
        );

      if (!userCheck.length || Number(userCheck[0].balance) < amount) {
          await query("ROLLBACK");
          return NextResponse.json(
            { success: false, message: "Insufficient balance" },
            { status: 400 }
          );
        }

        // Deduct balance
        await query(
          `UPDATE users SET ${walletColumn} = ${walletColumn} - $1 WHERE id = $2`,
          [amount, order.user_id]
        );
        
        // PPV BALANCE
        if (walletColumn !== "ppv_credit") {
          const ppvBenefits = amount * 0.01;
          await query(
            `UPDATE users SET ppv_credit = ppv_credit + $1 WHERE id = $2`,
            [ppvBenefits, order.user_id]
          );
        }

        // Update order status
        await query(
          `UPDATE orders SET status = 'approved' WHERE id = $1`,
          [orderIdNum]
        );

        // Update transaction status
        if (order.transaction_id) {
          await query(
            `UPDATE transactions SET status = 'approved' WHERE id = $1`,
            [order.transaction_id]
          );
        }

await query("COMMIT");

        // Send notification to user about order approval
        try {
          await query(
            `INSERT INTO notifications (user_id, title, message, type, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [
              order.user_id,
              "Order Approved",
              `Your order #${orderIdNum} for ₱${amount.toLocaleString()} has been approved. The amount has been deducted from your balance.`,
              "success"
            ]
          );
        } catch (notifyErr) {
          console.error("[products/orders/approve] notification error:", notifyErr);
          // Don't fail the request if notification fails
        }

        return NextResponse.json({
          success: true,
          message: "Order approved successfully",
          order: { ...order, status: "approved" },
        });
      } catch (innerError) {
        await query("ROLLBACK");
        throw innerError;
      }
    }

// Handle reject/cancel action
    if (action === "reject") {
      // Update order status to rejected
      await query(
        `UPDATE orders SET status = 'rejected' WHERE id = $1`,
        [orderIdNum]
      );

      // Update transaction status to rejected
      if (order.transaction_id) {
        await query(
          `UPDATE transactions SET status = 'rejected' WHERE id = $1`,
          [order.transaction_id]
        );
      }

      // Send notification to user about order rejection
      try {
        const amount = Number(order.tx_amount) || 0;
        await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            order.user_id,
            "Order Rejected",
            `Your order #${orderIdNum} for ₱${amount.toLocaleString()} has been rejected. Please contact support for more information.`,
            "warning"
          ]
        );
      } catch (notifyErr) {
        console.error("[products/orders/approve] notification error:", notifyErr);
        // Don't fail the request if notification fails
      }

      return NextResponse.json({
        success: true,
        message: "Order rejected",
        order: { ...order, status: "rejected" },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("[products/orders/approve] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
