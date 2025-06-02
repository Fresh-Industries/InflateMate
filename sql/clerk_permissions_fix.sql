-- Fix permissions for Clerk Third-Party Auth integration
-- Run this if you still get "permission denied for schema public"

-- Grant basic schema access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Ensure realtime is enabled for authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant sequence access
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Test if JWT claims are working
CREATE OR REPLACE FUNCTION test_jwt_claims()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  jwt_payload json;
  org_id_claim text;
BEGIN
  jwt_payload := auth.jwt();
  org_id_claim := COALESCE(
    jwt_payload ->> 'org_id',
    jwt_payload -> 'o' ->> 'id'
  );
  
  RETURN json_build_object(
    'full_jwt', jwt_payload,
    'org_id', org_id_claim,
    'user_id', jwt_payload ->> 'sub'
  );
END;
$$;

-- Test RLS function
SELECT test_jwt_claims(); 