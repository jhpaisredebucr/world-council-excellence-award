import { query } from "@/lib/db";

export async function getAdminAnalytics() {
  try {
    // Total Members
    const totalUser = await query("SELECT COUNT(*) FROM users WHERE status=$1 AND role =$2", ["approved", "member"]);
    const totalMembers = Number(totalUser[0].count);
    const totalOrders = await query("SELECT COUNT(*) FROM orders WHERE status=$1", ["pending"]);
    const totalPendingOrders = Number(totalOrders[0].count);

    // Pending Request
    const pendingRequest = await query(
      `
        SELECT 
          u.id,
          u.username,
          u.status,
          u.package,
          u.referred_by,
          u.created_at,
          p.first_name,
          p.last_name
        FROM users u
        JOIN user_profiles p ON p.user_id = u.id
        WHERE u.status = $1
        AND u.role = $2
      `,
      ["pending", "member"]
    );

    const approvedMembers = await query(
      `
        SELECT 
          u.id,
          u.username,
          u.status,
          u.package,
          u.referred_by,
          u.created_at,
          p.first_name,
          p.last_name
        FROM users u
        JOIN user_profiles p ON p.user_id = u.id
        WHERE u.status = $1
        AND u.role = $2
      `,
      ["approved", "member"]
    );

    const bannedMembers = await query(
      `
        SELECT 
          u.id,
          u.username,
          u.status,
          u.package,
          u.referred_by,
          u.created_at,
          p.first_name,
          p.last_name
        FROM users u
        JOIN user_profiles p ON p.user_id = u.id
        WHERE u.status = $1
        AND u.role = $2
      `,
      ["banned", "member"]
    );

    const topReferrer = await query(`
      SELECT 
        u.username,
        up.first_name,
        up.middle_name,
        up.last_name,
        COUNT(r.id) AS total_referred
      FROM users u
      JOIN users r 
        ON r.referred_by = u.referral_code
      JOIN user_profiles up 
        ON up.user_id = u.id
      GROUP BY 
        u.username,
        up.first_name,
        up.middle_name,
        up.last_name
      ORDER BY total_referred DESC
      LIMIT 1;
    `);
    
    const revenueResult = await query(`
      SELECT
        COALESCE(
          (
            SELECT SUM(amount)
            FROM transactions
            WHERE status = 'approved'
          ), 0
        )
        -
        COALESCE(
          (
            SELECT SUM(reward_amount)
            FROM referral_rewards
          ), 0
        )::float AS admin_revenue;
    `);
    const revenue = revenueResult[0];

    const totalPendingRequest = await query("SELECT COUNT(*) FROM users where status=$1", ["pending"]);
    const totalRequest = Number(totalPendingRequest[0].count);

    return {
      totalMembers,
      totalRequest,
      topReferrer,
      revenue,
      pendingRequest,
      approvedMembers,
      bannedMembers,
      totalPendingOrders
    };
  } catch (error) {
    console.error("[analytics.js] error:", error);
    return {
      totalMembers: 0,
      totalRequest: 0,
      topReferrer: [],
      revenue: { admin_revenue: 0 },
      pendingRequest: [],
      approvedMembers: [],
      bannedMembers: [],
      totalPendingOrders: 0
    };
  }
}