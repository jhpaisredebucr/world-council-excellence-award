import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";
import { calculateFees, validatePaymentMethod } from "@/lib/paymongo";

export async function POST(req) {
  try {
    const {
      user_id,
      amount,
      payment_method,
      account_info // received but not stored (col doesn't exist)
    } = await req.json();

    // Validate required fields
    if (!user_id || !amount || !payment_method) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!validatePaymentMethod(payment_method)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Check user's current balance
    const balanceResult = await query(
      "SELECT balance FROM users WHERE id = $1",
      [user_id]
    );

    if (balanceResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const currentBalance = Number(balanceResult[0].balance);
    
    // Calculate fees and total amount to deduct
    const feeCalculation = calculateFees(amount, payment_method, 'withdrawal');
    const totalDeduction = feeCalculation.totalAmount;

    // Check if user has sufficient balance
    if (currentBalance < totalDeduction) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Insufficient balance. Available: ₱${currentBalance.toFixed(2)}, Required: ₱${totalDeduction.toFixed(2)}` 
        },
        { status: 400 }
      );
    }

    // Generate reference number
    const reference_number = `WTH${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Start transaction
    await query('BEGIN');

    try {
      // Deduct amount from user balance
      await query(
        "UPDATE users SET balance = balance - $1 WHERE id = $2",
        [totalDeduction, user_id]
      );

      // Create withdrawal transaction record
      await query(
        `INSERT INTO transactions (
          user_id,
          type,
          amount,
          fee,
          payment_method,
          account_info,
          reference_number,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          user_id,
          'withdrawal',
          amount,
          feeCalculation.fee,
          payment_method,
          account_info,
          reference_number,
          'pending'
        ]
      );

      // Commit transaction
      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: "Withdrawal request submitted successfully",
        transaction: {
          reference_number,
          amount,
          fee: feeCalculation.fee,
          total_deduction: totalDeduction,
          payment_method,
          status: 'pending',
          account_info: account_info.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4')
        }
      });

    } catch (transactionError) {
      // Rollback on error
      await query('ROLLBACK');
      throw transactionError;
    }

  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

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

    // Get withdrawal transactions for the user
    const withdrawals = await query(
      `SELECT id, amount, fee, payment_method, reference_number,
              status, created_at, account_info,
              CASE
                WHEN account_info ~ '^[0-9]{11}$' THEN CONCAT('****', SUBSTRING(account_info, 8, 4))
                WHEN account_info ~ '^[0-9]{12,16}$' THEN CONCAT('****', SUBSTRING(account_info, -4))
                ELSE '****'
              END as masked_account
       FROM transactions
       WHERE user_id = $1 AND type = 'withdrawal'
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userID, limit, offset]
    );

    // Get total count for pagination
    const totalResult = await query(
      "SELECT COUNT(*) FROM transactions WHERE user_id = $1 AND type = 'withdrawal'",
      [userID]
    );
    const total = Number(totalResult[0].count);

    return NextResponse.json({
      success: true,
      withdrawals,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    });

  } catch (error) {
    console.error("Get withdrawals error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
