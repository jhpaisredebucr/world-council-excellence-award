import { query } from "@/lib/db";

export async function getMemberDashboardData({
  userReferralCode,
  limit = 20,
  offset = 0,
}) {
  try {
    if (!userReferralCode) {
      throw new Error("userReferralCode required");
    }

    const safeLimit = Math.min(parseInt(limit), 100);
    const safeOffset = parseInt(offset);

    // Get total count of level 1 referred members
    const totalCountRes = await query(
      `SELECT COUNT(*) AS total_count FROM users WHERE referred_by = $1`,
      [userReferralCode]
    );

    const totalReferredMembers = Number(totalCountRes[0]?.total_count || 0);

    // Get referred members (level 1 descendants)
    const referredMembers = await query(
      `
      SELECT 
          u.id,
          u.username,
          u.status,
          u.referral_code,
          u.created_at,
          p.first_name,
          p.last_name
      FROM users u
      JOIN user_profiles p ON p.user_id = u.id
      WHERE u.referred_by = $1
      ORDER BY u.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userReferralCode, safeLimit, safeOffset]
    );

    const pendingCount = referredMembers.filter(
      (member) => member.status === "pending"
    ).length;

    // User Wallet
    const userWallet = await query(
      `
        SELECT balance, pc_credit, ppv_credit
        FROM users
        WHERE referral_code = $1;
      `,
      [userReferralCode]
    );

    const { balance, pc_credit, ppv_credit } = userWallet[0];

    // Total Order Spent
    const totalOrderRes = await query(
      `
      SELECT COALESCE(SUM(p.price), 0) AS total_spent
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON u.id = o.user_id
      WHERE u.referral_code = $1
      `,
      [userReferralCode]
    );


    const totalSpent = Number(
      totalOrderRes[0]?.total_spent || 0
    );

    const activeMembers = totalReferredMembers - pendingCount;

    return {
      dashboardData: {
        totalReferredMembers,
        pendingCount,
        activeMembers,
        totalSpent,
        referredMembers,
        balance, 
        pc_credit, 
        ppv_credit
      },
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        total: totalReferredMembers,
        hasMore: referredMembers.length === safeLimit,
      },
    };
  } catch (error) {
    console.error("[getReferralDashboardData] error:", error);
    throw error;
  }
}
