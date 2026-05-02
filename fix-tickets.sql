-- Fix tickets table: Drop and recreate to ensure proper structure
-- Run these commands in order

-- 1. Drop existing table if it has wrong columns (backup first)
-- CREATE TABLE tickets_backup AS SELECT * FROM tickets;

-- 2. Drop the old table
DROP TABLE IF EXISTS tickets CASCADE;

-- 3. Create fresh tickets table with proper structure
CREATE TABLE tickets (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add constraints
ALTER TABLE tickets 
ADD CONSTRAINT tickets_category_check CHECK (category IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion', 'other')),
ADD CONSTRAINT tickets_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD CONSTRAINT tickets_status_check CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));

-- 5. Insert a test ticket (optional)
-- INSERT INTO tickets (user_id, subject, message, category, priority, status)
-- VALUES (1, 'Test Ticket', 'This is a test ticket', 'general', 'medium', 'open');

-- 6. Verify the table
SELECT * FROM tickets ORDER BY created_at DESC LIMIT 10;
