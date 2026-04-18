-- Keep public.personal_info.email aligned with auth.users.email when the address changes
-- (e.g. after the user confirms a new email). INSERT-only triggers miss this case.

CREATE OR REPLACE FUNCTION public.sync_personal_info_email_from_auth()
RETURNS trigger AS $$
BEGIN
  UPDATE public.personal_info
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_updated_personal_info ON auth.users;

CREATE TRIGGER on_auth_user_email_updated_personal_info
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (NEW.email IS DISTINCT FROM OLD.email)
  EXECUTE PROCEDURE public.sync_personal_info_email_from_auth();
