import { pool } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status, admin_response } = await request.json();
    
    // Get admin user ID from session (you'll need to implement session management)
    const cookieHeader = request.headers.get('cookie');
    let adminId = null;
    
    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users`, {
        headers: {
          'cookie': cookieHeader || ''
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.userInfo && userData.userInfo.role === 'admin') {
          adminId = userData.userInfo.id;
        }
      }
    } catch (authError) {
      console.error("Auth error:", authError);
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    
    if (admin_response !== undefined) {
      updates.push(`admin_response = $${paramIndex++}`);
      values.push(admin_response);
      
      if (adminId) {
        updates.push(`admin_id = $${paramIndex++}`);
        values.push(adminId);
      }
    }
    
    if (updates.length === 0) {
      return Response.json({
        success: false,
        message: "No valid updates provided"
      }, { status: 400 });
    }
    
    values.push(id);
    
    const query = `
      UPDATE tickets 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return Response.json({
        success: false,
        message: "Ticket not found"
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      ticket: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return Response.json({
      success: false,
      message: "Failed to update ticket"
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await pool.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return Response.json({
        success: false,
        message: "Ticket not found"
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return Response.json({
      success: false,
      message: "Failed to delete ticket"
    }, { status: 500 });
  }
}
