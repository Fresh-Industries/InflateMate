-- Fix RLS function for Clerk Third-Party Auth session tokens
-- The org ID is in jwt().o.id, not jwt().org_id

CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For Clerk session tokens, org ID is nested in 'o' object
  RETURN COALESCE(
    auth.jwt() -> 'o' ->> 'id',           -- Primary: o.id 
    auth.jwt() ->> 'org_id'               -- Fallback: direct org_id
  );
END;
$$;

-- Create the public wrapper function for testing
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.get_user_organization_id();
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION auth.get_user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_organization_id() TO authenticated;

-- Test the function (should return your org ID when authenticated)
SELECT 'RLS function updated for Clerk session token format' as status; 