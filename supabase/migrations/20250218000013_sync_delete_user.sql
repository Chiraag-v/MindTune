-- Create a function to delete the auth user
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_personal_info_delete()
RETURNS trigger AS $$
BEGIN
  -- Attempt to delete the user from auth.users
  -- This ensures that deleting a row in personal_info removes the login credentials
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on personal_info
DROP TRIGGER IF EXISTS on_personal_info_deleted ON public.personal_info;
CREATE TRIGGER on_personal_info_deleted
  AFTER DELETE ON public.personal_info
  FOR EACH ROW EXECUTE PROCEDURE public.delete_auth_user_on_personal_info_delete();
