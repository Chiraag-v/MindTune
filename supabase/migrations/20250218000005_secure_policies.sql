-- Revoke UPDATE on optimization_logs for anon (updates are handled via API with service key)
DROP POLICY IF EXISTS "Allow anon update" ON public.optimization_logs;

-- Revoke INSERT on optimization_logs for anon (inserts are handled via API with service key)
DROP POLICY IF EXISTS "Allow anon insert" ON public.optimization_logs;
