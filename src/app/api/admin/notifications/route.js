import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

// Helper function to check if user is admin
async function isAdmin(userId) {
  try {
    const result = await query(
      "SELECT role FROM users WHERE id = $1",
      [userId]
    );
    
    return result.length > 0 && result[0].role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

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

    const adminUserId = decoded.id;

    // Check if user is admin
    const adminCheck = await isAdmin(adminUserId);
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, message, type = "info", target, userIds, role } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 }
      );
    }

    let result;

    switch (target) {
      case "all":
        // Create notification for all users
        const allUsersRes = await query("SELECT id FROM users WHERE role != 'admin'");
        const allUserIds = allUsersRes.map(user => user.id);
        
        if (allUserIds.length === 0) {
          return NextResponse.json(
            { success: false, message: "No users found" },
            { status: 404 }
          );
        }

        // Bulk insert for all users
        const values = allUserIds.map((userId, index) => 
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, NOW())`
        ).join(', ');
        
        const params = [];
        allUserIds.forEach(userId => {
          params.push(userId, title, message, type);
        });

        result = await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at) 
           VALUES ${values} RETURNING *`,
          params
        );
        
        break;

      case "specific":
        // Create notification for specific users
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          return NextResponse.json(
            { success: false, message: "User IDs array is required for specific target" },
            { status: 400 }
          );
        }

        // Verify users exist
        const usersRes = await query(
          `SELECT id FROM users WHERE id = ANY($1)`,
          [userIds]
        );

        if (usersRes.length === 0) {
          return NextResponse.json(
            { success: false, message: "No valid users found" },
            { status: 404 }
          );
        }

        const validUserIds = usersRes.map(user => user.id);
        
        // Bulk insert for specific users
        const specificValues = validUserIds.map((userId, index) => 
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, NOW())`
        ).join(', ');
        
        const specificParams = [];
        validUserIds.forEach(userId => {
          specificParams.push(userId, title, message, type);
        });

        result = await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at) 
           VALUES ${specificValues} RETURNING *`,
          specificParams
        );
        
        break;

      case "role":
        // Create notification for users with specific role
        
        if (!role) {
          return NextResponse.json(
            { success: false, message: "Role is required for role-based target" },
            { status: 400 }
          );
        }

        const roleUsersRes = await query(
          "SELECT id FROM users WHERE role = $1 AND id != $2",
          [role, adminUserId]
        );

        if (roleUsersRes.length === 0) {
          return NextResponse.json(
            { success: false, message: "No users found with specified role" },
            { status: 404 }
          );
        }

        const roleUserIds = roleUsersRes.map(user => user.id);
        
        // Bulk insert for role-based users
        const roleValues = roleUserIds.map((userId, index) => 
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, NOW())`
        ).join(', ');
        
        const roleParams = [];
        roleUserIds.forEach(userId => {
          roleParams.push(userId, title, message, type);
        });

        result = await query(
          `INSERT INTO notifications (user_id, title, message, type, created_at) 
           VALUES ${roleValues} RETURNING *`,
          roleParams
        );
        
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid target. Must be 'all', 'specific', or 'role'" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Notifications created successfully for ${result.length} user(s)`,
      notifications: result
    });

  } catch (err) {
    console.error("Error creating admin notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

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

    const adminUserId = decoded.id;

    // Check if user is admin
    const adminCheck = await isAdmin(adminUserId);
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    
    const offset = (page - 1) * limit;
    
    let whereClause = "WHERE 1=1";
    const params = [];
    let paramIndex = 1;
    
    if (userId) {
      whereClause += ` AND n.user_id = $${paramIndex++}`;
      params.push(userId);
    }
    
    if (unreadOnly) {
      whereClause += ` AND n.read = false`;
    }

    // Get total count
    const countRes = await query(
      `SELECT COUNT(*) as total 
       FROM notifications n 
       ${whereClause}`,
      params
    );

    // Get notifications with user info
    const notificationsRes = await query(
      `SELECT n.*, u.username, up.first_name, up.last_name 
       FROM notifications n 
       LEFT JOIN users u ON n.user_id = u.id 
       LEFT JOIN user_profiles up ON n.user_id = up.user_id 
       ${whereClause} 
       ORDER BY n.created_at DESC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      success: true,
      notifications: notificationsRes,
      pagination: {
        page,
        limit,
        total: parseInt(countRes[0].total),
        totalPages: Math.ceil(countRes[0].total / limit)
      }
    });

  } catch (err) {
    console.error("Error fetching admin notifications:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
