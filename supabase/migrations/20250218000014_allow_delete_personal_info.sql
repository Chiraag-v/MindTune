-- Allow users to delete their own personal info (which triggers account deletion)
CREATE POLICY "Users can delete their own personal info" 
  ON public.personal_info FOR DELETE 
  USING (auth.uid() = id);
