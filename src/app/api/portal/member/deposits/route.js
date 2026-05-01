import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";
import { createCheckoutSession, calculateFees, validatePaymentMethod } from "@/lib/paymongo";

export async function POST(req) {
  try {
    const { 
      user_id, 
      amount, 
      payment_method, 
      customer_info,
      use_paymongo = false 
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

    // Calculate fees
    const feeCalculation = calculateFees(amount, payment_method, 'deposit');
    
    let checkoutSession = null;
    let reference_number = null;
    let payment_status = 'pending';

    // Use PayMongo if requested
    if (use_paymongo && payment_method === 'paymongo_checkout') {
      try {
        // Map payment method to PayMongo payment methods
        const payMongoPaymentMethods = [];
        if (payment_method === 'paymongo_checkout') {
          payMongoPaymentMethods.push('gcash', 'paymaya', 'bank_transfer', 'card');
        }

        checkoutSession = await createCheckoutSession(
          feeCalculation.totalAmount,
          payMongoPaymentMethods,
          customer_info || {}
        );
        
        reference_number = checkoutSession.data.id;
        payment_status = 'awaiting_payment';
      } catch (paymongoError) {
        console.error("PayMongo error:", paymongoError);
        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to create payment session. Please try again." 
          },
          { status: 500 }
        );
      }
    } else {
      // Generate reference number for manual deposits
      reference_number = `DEP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }

    // Save transaction to database
    await query(
      `INSERT INTO transactions (
        user_id, 
        type, 
        amount, 
        fee, 
        net_amount, 
        payment_method, 
        reference_number, 
        status, 
        payment_session_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [
        user_id,
        'deposit',
        amount,
        feeCalculation.fee,
        feeCalculation.netAmount,
        payment_method,
        reference_number,
        payment_status,
        checkoutSession?.data?.id || null
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Deposit created successfully",
      transaction: {
        reference_number,
        amount,
        fee: feeCalculation.fee,
        net_amount: feeCalculation.netAmount,
        total_amount: feeCalculation.totalAmount,
        payment_method,
        status: payment_status,
        fee_breakdown: feeCalculation.breakdown,
        checkout_url: checkoutSession?.data?.attributes?.checkout_url || null
      }
    });

  } catch (error) {
    console.error("Deposit API error:", error);
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

    // Get deposit transactions for the user
    const deposits = await query(
      `SELECT id, amount, fee, net_amount, payment_method, reference_number, 
              status, payment_session_id, created_at
       FROM transactions 
       WHERE user_id = $1 AND type = 'deposit' 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userID, limit, offset]
    );

    // Get total count for pagination
    const totalResult = await query(
      "SELECT COUNT(*) FROM transactions WHERE user_id = $1 AND type = 'deposit'",
      [userID]
    );
    const total = Number(totalResult[0].count);

    return NextResponse.json({
      success: true,
      deposits,
      pagination: { total, limit, offset, hasMore: offset + limit < total }
    });

  } catch (error) {
    console.error("Get deposits error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
