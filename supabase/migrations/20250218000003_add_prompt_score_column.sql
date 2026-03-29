-- Add prompt_score column for storing quality score (0-100) of the optimized prompt
ALTER TABLE public.optimization_logs ADD COLUMN IF NOT EXISTS prompt_score integer;
