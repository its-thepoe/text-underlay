-- Check the profiles table structure
-- Run this in your Supabase SQL editor

-- Show table structure
\d profiles

-- Show table columns with details
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
AND table_schema = 'public'; 