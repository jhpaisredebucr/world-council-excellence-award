import { pool } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = `
      SELECT t.*, u.username, u.role
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE t.status = $1';
      params.push(status);
    }
    
    const result = await pool.query(query, params);
    
    return Response.json({
      success: true,
      tickets: result.rows
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch tickets"
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { subject, message, category, priority } = await request.json();
    
    // Get user from session (you'll need to implement session management)
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    // For now, we'll assume user ID is available in the session
    // You should replace this with your actual authentication logic
    let userId = 1; // Default user ID - replace with actual auth
    
    // Try to get user ID from session if available
    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users`, {
        headers: {
          'cookie': cookieHeader || ''
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.userInfo) {
          userId = userData.userInfo.id;
        }
      }
    } catch (authError) {
      console.error("Auth error:", authError);
      // Continue with default user ID
    }
    
    const result = await pool.query(
      `INSERT INTO tickets (user_id, subject, message, category, priority) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [userId, subject, message, category, priority]
    );
    
    return Response.json({
      success: true,
      ticket: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return Response.json({
      success: false,
      message: "Failed to create ticket"
    }, { status: 500 });
  }
}
