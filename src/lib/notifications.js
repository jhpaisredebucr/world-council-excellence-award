import { query } from "./db";

// Create a notification for a user
export async function createNotification(userId, title, message, type = "info") {
  try {
    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [userId, title, message, type]
    );
    
    return result[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Create notifications for multiple users (SQL-injection safe)
export async function createBulkNotifications(userIds, title, message, type = "info") {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  try {
    // Use Postgres UNNEST with safe parameterized arrays — no string interpolation
    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type, created_at)
       SELECT * FROM UNNEST($1::int[], $2::text[], $3::text[], $4::text[], NOW()::timestamptz[])
       AS t(user_id, title, message, type, created_at)
       RETURNING *`,
      [userIds, userIds.map(() => title), userIds.map(() => message), userIds.map(() => type)]
    );

    return result;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
}

// Get unread notification count for a user
export async function getUnreadCount(userId) {
  try {
    const result = await query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false",
      [userId]
    );
    
    return parseInt(result[0].count);
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
}

// Mark notification as read
export async function markAsRead(notificationId, userId) {
  try {
    const result = await query(
      `UPDATE notifications 
       SET read = true, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [notificationId, userId]
    );
    
    return result[0];
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Mark all notifications as read for a user
export async function markAllAsRead(userId) {
  try {
    const result = await query(
      `UPDATE notifications 
       SET read = true, updated_at = NOW() 
       WHERE user_id = $1 AND read = false 
       RETURNING *`,
      [userId]
    );
    
    return result;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

// Delete notification
export async function deleteNotification(notificationId, userId) {
  try {
    const result = await query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *",
      [notificationId, userId]
    );
    
    return result[0];
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

// Get notifications with pagination
export async function getNotifications(userId, page = 1, limit = 10, unreadOnly = false) {
  try {
    const offset = (page - 1) * limit;
    let whereClause = "WHERE user_id = $1";
    const params = [userId];
    
    if (unreadOnly) {
      whereClause += " AND read = false";
    }
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
      params
    );
    
    // Get notifications
    const notificationsResult = await query(
      `SELECT * FROM notifications 
       ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );
    
    return {
      notifications: notificationsResult,
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0].total),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
}

// Common notification templates
export const notificationTemplates = {
  welcome: (userName) => ({
    title: "Welcome to WCEA!",
    message: `Hi ${userName}! Welcome to our platform. We're excited to have you on board.`,
    type: "success"
  }),
  
  paymentReceived: (amount) => ({
    title: "Payment Received",
    message: `Your payment of $${amount} has been successfully processed.`,
    type: "success"
  }),
  
  paymentFailed: (amount) => ({
    title: "Payment Failed",
    message: `Your payment of $${amount} could not be processed. Please try again.`,
    type: "error"
  }),
  
  profileUpdated: () => ({
    title: "Profile Updated",
    message: "Your profile has been successfully updated.",
    type: "info"
  }),
  
  securityAlert: (action) => ({
    title: "Security Alert",
    message: `A ${action} was performed on your account. If this wasn't you, please contact support.`,
    type: "warning"
  }),
  
  systemMaintenance: () => ({
    title: "System Maintenance",
    message: "We'll be performing scheduled maintenance. Some features may be temporarily unavailable.",
    type: "system"
  })
};
