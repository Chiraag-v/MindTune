-- Add explanation and changes columns to optimization_logs
ALTER TABLE public.optimization_logs
ADD COLUMN IF NOT EXISTS explanation text,
ADD COLUMN IF NOT EXISTS changes text;

-- Create optimization_qa table for storing Q&A history
CREATE TABLE IF NOT EXISTS public.optimization_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for faster QA lookups by session_id
CREATE INDEX IF NOT EXISTS idx_optimization_qa_session_id ON public.optimization_qa (session_id);

-- Enable RLS on optimization_qa
ALTER TABLE public.optimization_qa ENABLE ROW LEVEL SECURITY;

-- Allow anon to INSERT (for client-side QA if needed, though we use API)
-- Actually, we use API with service key, so no anon policies needed for now.
-- But if we want to read history securely later, we might need policies.
-- For now, we follow the pattern of optimization_logs: no anon access, API handles it.
