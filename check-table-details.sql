-- Get detailed table structure and constraints
-- Run this in your Supabase SQL editor

-- Show all columns with their details
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show the specific CHECK constraint that's failing
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';

-- Show any NOT NULL constraints
SELECT 
    column_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
AND is_nullable = 'NO'
ORDER BY ordinal_position; 