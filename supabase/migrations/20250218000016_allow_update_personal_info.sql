CREATE POLICY "Users can update their own personal info"
  ON public.personal_info FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
