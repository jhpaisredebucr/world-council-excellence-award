import { query } from "@/lib/db";


export async function getTransactions({
  userID,
  role,
  limit = 50,
  offset = 0
}) {
  try {
    const safeLimit = Math.min(parseInt(limit), 100);
    const safeOffset = parseInt(offset);

    const baseSelect =
      "SELECT id, user_id, amount, type, status, created_at, payment_method, reference_number FROM transactions";

    let transactions;

    if (role === "admin") {
      transactions = await query(
        `${baseSelect}
         WHERE type != $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        ["plan", safeLimit, safeOffset]
      );
    } else {
      transactions = await query(
        `${baseSelect}
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userID, safeLimit, safeOffset]
      );
    }

    // pagination total count
    let totalQuery;
    let params;

    if (role === "admin") {
      totalQuery =
        "SELECT COUNT(*) FROM transactions WHERE type != $1";
      params = ["plan"];
    } else {
      totalQuery =
        "SELECT COUNT(*) FROM transactions WHERE user_id = $1";
      params = [userID];
    }

    const totalResult = await query(totalQuery, params);
    const total = Number(totalResult[0].count);

    return {
      success: true,
      transactions,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        hasMore: safeOffset + safeLimit < total
      }
    };

  } catch (err) {
    console.error("[getTransactions] error:", err);

    return {
      success: false,
      message: err.message || "Server error"
    };
  }
}