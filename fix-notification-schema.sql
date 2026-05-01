-- Fix Notification Schema
-- Remove the conflicting user_notifications table and ensure notifications table works correctly

-- Drop the conflicting user_notifications table
DROP TABLE IF EXISTS user_notifications CASCADE;

-- Ensure the notifications table has all required columns
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info',
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add constraint for notification types
ALTER TABLE notifications 
ADD CONSTRAINT IF NOT EXISTS check_notification_type 
CHECK (type IN ('info', 'success', 'warning', 'error', 'system'));

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON notifications;
CREATE TRIGGER trigger_update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_notifications_updated_at();

-- Update any existing notifications without user_id
-- Set to a default user (adjust as needed for your application)
UPDATE notifications SET user_id = 1 WHERE user_id IS NULL;

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
