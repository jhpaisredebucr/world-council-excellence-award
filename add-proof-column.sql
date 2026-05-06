-- Add proof column to transactions table for deposit proof of payment
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS proof TEXT;