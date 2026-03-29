-- Add columns for history feature: user_id, original_prompt, optimized_prompt
ALTER TABLE public.optimization_logs
ADD COLUMN IF NOT EXISTS user_id text,
ADD COLUMN IF NOT EXISTS original_prompt text,
ADD COLUMN IF NOT EXISTS optimized_prompt text;

-- Index for faster history lookups
CREATE INDEX IF NOT EXISTS idx_optimization_logs_user_id ON public.optimization_logs (user_id);
