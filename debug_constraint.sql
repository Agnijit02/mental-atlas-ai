-- Debug script to check if the mindmap constraint was properly applied

-- 1. Check current constraints on ai_sessions table
SELECT
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.ai_sessions'::regclass;

-- 2. Try to insert a mindmap session (this should work after the fix)
-- INSERT INTO public.ai_sessions (user_id, document_id, session_type, response)
-- VALUES ('00000000-0000-0000-0000-000000000000', NULL, 'mindmap', '{"test": "data"}');

-- 3. Check if mindmap sessions exist
SELECT session_type, COUNT(*) as count
FROM public.ai_sessions
GROUP BY session_type
ORDER BY session_type;

-- 4. Check the table structure
\d public.ai_sessions
