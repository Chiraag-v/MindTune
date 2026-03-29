ALTER TABLE public.personal_info ADD COLUMN IF NOT EXISTS username text UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS personal_info_username_lower_idx ON public.personal_info (lower(username));
