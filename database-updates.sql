-- Database Schema Updates for PayMongo Integration and Enhanced Transaction Management
-- Run these SQL commands to update your database schema

-- Add status column to orders table if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Add new columns to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_info TEXT,
ADD COLUMN IF NOT EXISTS payment_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Add balance column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Update existing transactions to have default values
UPDATE transactions 
SET fee = 0, 
    net_amount = amount, 
    status = CASE 
        WHEN status IS NULL OR status = '' THEN 'completed'
        ELSE status 
    END
WHERE fee IS NULL OR net_amount IS NULL;

-- Add transaction types constraint if needed
ALTER TABLE transactions 
ADD CONSTRAINT IF NOT EXISTS check_transaction_type 
CHECK (type IN ('deposit', 'withdrawal', 'plan', 'commission', 'bonus', 'purchase'));

-- Add transaction status constraint (include approved/rejected for order purchases)
ALTER TABLE transactions 
ADD CONSTRAINT IF NOT EXISTS check_transaction_status 
CHECK (status IN ('pending', 'awaiting_payment', 'processing', 'completed', 'failed', 'cancelled', 'approved', 'rejected'));

-- Add wallet_type column for tracking which wallet was used for purchase
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS wallet_type VARCHAR(50) DEFAULT 'balance';

-- Create a transaction history view for easier querying
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.id,
    t.user_id,
    u.first_name || ' ' || u.last_name as user_name,
    t.type,
    t.amount,
    t.fee,
    t.net_amount,
    t.payment_method,
    t.reference_number,
    t.status,
    t.created_at,
    CASE 
        WHEN t.type = 'deposit' THEN 'Credit'
        WHEN t.type = 'withdrawal' THEN 'Debit'
        ELSE 'Neutral'
    END as transaction_direction
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id;

-- Create a function to update user balance (triggers can be added if needed)
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'deposit' AND NEW.status = 'completed' THEN
        UPDATE users SET balance = balance + NEW.net_amount WHERE id = NEW.user_id;
    ELSIF NEW.type = 'withdrawal' AND NEW.status = 'completed' THEN
        UPDATE users SET balance = balance - NEW.amount WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create trigger to automatically update balances
-- Uncomment the line below if you want automatic balance updates
-- CREATE TRIGGER trigger_update_user_balance 
--     AFTER INSERT OR UPDATE ON transactions 
--     FOR EACH ROW 
--     WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM NEW.status)
--     EXECUTE FUNCTION update_user_balance();
