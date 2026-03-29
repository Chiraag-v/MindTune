-- Drop the trigger and function for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the profiles table
DROP TABLE IF EXISTS public.profiles;

-- Remove the foreign key constraint from optimization_logs to auth.users
-- This allows us to keep the logs even if they aren't linked to a real auth user anymore
ALTER TABLE public.optimization_logs DROP CONSTRAINT IF EXISTS fk_optimization_logs_user;

-- Optional: If you want to clear all user_ids from logs to make them truly anonymous
-- UPDATE public.optimization_logs SET user_id = NULL;
