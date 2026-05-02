-- Check tickets table structure and data
-- Run these queries in your database to see what's happening

-- 1. Check if tickets table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tickets'
ORDER BY ordinal_position;

-- 2. Check all tickets with their IDs
SELECT id, subject, status, user_id, created_at 
FROM tickets 
ORDER BY created_at DESC 
LIMIT 20;

-- 3. Create the tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    admin_response TEXT,
    admin_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tickets_category_check CHECK (category IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion', 'other')),
    CONSTRAINT tickets_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT tickets_status_check CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);

-- 4. Test updating a ticket (replace with actual ticket ID from your data)
-- UPDATE tickets SET status = 'in_progress' WHERE id = 1 RETURNING *;
