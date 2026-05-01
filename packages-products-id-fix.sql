-- Fix for packages and products table id column not auto-incrementing
-- This SQL fixes the null id issue when creating new packages/products from admin panel

-- ============================================
-- FIX PACKAGES TABLE
-- ============================================

-- Step 1: Add a sequence for the packages table (if not exists)
CREATE SEQUENCE IF NOT EXISTS packages_id_seq;

-- Step 2: Set the default value for id column to use the sequence
ALTER TABLE packages 
ALTER COLUMN id SET DEFAULT nextval('packages_id_seq');

-- Step 3: Make the id column owned by the sequence
ALTER SEQUENCE packages_id_seq OWNED BY packages.id;

-- ============================================
-- FIX PRODUCTS TABLE (same fix)
-- ============================================

-- Step 1: Add a sequence for the products table (if not exists)
CREATE SEQUENCE IF NOT EXISTS products_id_seq;

-- Step 2: Set the default value for id column to use the sequence
ALTER TABLE products 
ALTER COLUMN id SET DEFAULT nextval('products_id_seq');

-- Step 3: Make the id column owned by the sequence
ALTER SEQUENCE products_id_seq OWNED BY products.id;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify the fix worked:
-- ============================================

-- Check packages table sequences
-- SELECT column_name, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'packages' AND column_name = 'id';

-- Check products table sequences
-- SELECT column_name, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'id';

-- Test insert (should auto-generate id now)
-- INSERT INTO packages (user_id, package_name, description, price, img_url) 
-- VALUES (1, 'Test Package', 'Test description', 100.00, 'test.jpg');
-- SELECT * FROM packages ORDER BY id DESC LIMIT 1;
