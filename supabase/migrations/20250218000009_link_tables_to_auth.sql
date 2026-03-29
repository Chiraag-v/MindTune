-- 1. Clean up user_id in optimization_logs
-- Set user_id to NULL if it doesn't match a real auth user (handling legacy anonymous IDs)
UPDATE public.optimization_logs 
SET user_id = NULL 
WHERE user_id IS NOT NULL 
  AND user_id::uuid NOT IN (SELECT id FROM auth.users);

-- 2. Convert user_id to UUID and add Foreign Key to auth.users
ALTER TABLE public.optimization_logs 
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid,
  ADD CONSTRAINT fk_optimization_logs_user 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- 3. Ensure session_id is unique in optimization_logs to allow referencing it
-- (If there are duplicates, this might fail, but our app logic generates unique IDs)
ALTER TABLE public.optimization_logs 
  ADD CONSTRAINT unique_session_id UNIQUE (session_id);

-- 4. Link optimization_qa to optimization_logs via session_id
-- First, clean up any orphaned QA entries that don't have a matching log
DELETE FROM public.optimization_qa
WHERE session_id NOT IN (SELECT session_id FROM public.optimization_logs);

-- Then add the Foreign Key constraint
ALTER TABLE public.optimization_qa 
  ADD CONSTRAINT fk_optimization_qa_session 
    FOREIGN KEY (session_id) 
    REFERENCES public.optimization_logs(session_id) 
    ON DELETE CASCADE;
