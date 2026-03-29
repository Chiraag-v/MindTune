-- Update trigger to read username from user metadata set during signup
CREATE OR REPLACE FUNCTION public.handle_new_user_personal_info()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.personal_info (id, email, username)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, public.personal_info.username);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
