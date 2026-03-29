-- Add feedback_text column for storing user comments on negative feedback
ALTER TABLE public.optimization_logs ADD COLUMN IF NOT EXISTS feedback_text text;
