-- Adds columns needed to credit/debit net amounts for deposits/withdrawals
-- Run against your database (Postgres)

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2) DEFAULT 0;

-- For withdrawals: store the total amount that was deducted at request time (amount + fee)
-- For deposits: you can store NULL/0, or also store gross in total_deduction if you prefer.
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS total_deduction DECIMAL(10,2) DEFAULT 0;

-- Ensure fee has a default (already present in your repo script sometimes)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) DEFAULT 0;

-- (Optional) index helpers
CREATE INDEX IF NOT EXISTS idx_transactions_net_amount ON transactions(net_amount);
CREATE INDEX IF NOT EXISTS idx_transactions_total_deduction ON transactions(total_deduction);

