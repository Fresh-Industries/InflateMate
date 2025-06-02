-- Make the RLS function callable for testing
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.get_user_organization_id();
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_organization_id() TO authenticated; 