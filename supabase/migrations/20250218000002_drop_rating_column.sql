-- Remove rating column; feedback column is used for thumbs up/down
ALTER TABLE public.optimization_logs DROP COLUMN IF EXISTS rating;
