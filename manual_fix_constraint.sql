-- Manual fix for mindmap constraint issue
-- Run this in your Supabase SQL Editor if the migration didn't work

-- Step 1: Check current constraints
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.ai_sessions'::regclass
AND conname LIKE '%session_type%';

-- Step 2: Drop the old constraint (if it exists)
ALTER TABLE public.ai_sessions
DROP CONSTRAINT IF EXISTS ai_sessions_session_type_check;

-- Step 3: Add the new constraint with mindmap included
ALTER TABLE public.ai_sessions
ADD CONSTRAINT ai_sessions_session_type_check
CHECK (session_type IN ('summary', 'faq', 'chat', 'mindmap'));

-- Step 4: Verify the constraint was applied
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.ai_sessions'::regclass
AND conname LIKE '%session_type%';

-- Step 5: Test the constraint by trying to insert a mindmap record
-- (Uncomment and modify with real user_id if you want to test)
-- INSERT INTO public.ai_sessions (user_id, session_type, response)
-- VALUES ('your-user-id-here', 'mindmap', '{"test": "mindmap data"}');
