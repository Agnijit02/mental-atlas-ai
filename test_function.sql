-- Test if the process-document function is deployed and working
-- Run this in Supabase SQL Editor

-- Test 1: Check if function exists in the database
SELECT
    routine_name,
    routine_type,
    external_language
FROM information_schema.routines
WHERE routine_name LIKE '%process%'
AND routine_schema = 'public';

-- Test 2: Check Supabase Edge Functions (if available)
-- Note: Edge Functions might not be visible in regular SQL queries
-- You can check them in the Supabase Dashboard under Functions

-- Test 3: Verify ai_sessions table can accept mindmap
INSERT INTO public.ai_sessions (user_id, session_type, response)
VALUES ('00000000-0000-0000-0000-000000000000', 'mindmap', '{"test": "data"}');

-- If this works, the constraint is fixed
-- If it fails, the constraint still has issues

-- Clean up test data
DELETE FROM public.ai_sessions
WHERE user_id = '00000000-0000-0000-0000-000000000000'
AND response = '{"test": "data"}';
