-- Update existing category values if they exist
UPDATE tickets SET category = 'bug_report' WHERE category = 'bug';
UPDATE tickets SET category = 'feature_request' WHERE category = 'feature';

-- Alter the CHECK constraint to allow new category values
ALTER TABLE tickets DROP CONSTRAINT tickets_category_check;

ALTER TABLE tickets ADD CONSTRAINT tickets_category_check 
    CHECK (category IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion', 'other'));
