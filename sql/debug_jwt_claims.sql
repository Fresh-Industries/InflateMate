-- Step 1: Debug JWT Claims from Clerk
-- Run this in your Supabase SQL Editor to see what claims are available

CREATE OR REPLACE FUNCTION debug_jwt_claims()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  jwt_payload json;
BEGIN
  jwt_payload := auth.jwt();
  
  RETURN json_build_object(
    'has_jwt', jwt_payload IS NOT NULL,
    'user_id', jwt_payload ->> 'sub',
    'org_id', jwt_payload ->> 'org_id',
    'role', jwt_payload ->> 'role',
    'aud', jwt_payload ->> 'aud',
    'iss', jwt_payload ->> 'iss',
    'all_keys', CASE 
      WHEN jwt_payload IS NOT NULL 
      THEN array(SELECT json_object_keys(jwt_payload))
      ELSE ARRAY[]::text[]
    END,
    'org_structure', jwt_payload -> 'org',
    'organizations_array', jwt_payload -> 'organizations',
    'user_metadata', jwt_payload -> 'user_metadata',
    'app_metadata', jwt_payload -> 'app_metadata',
    'full_payload', jwt_payload
  );
END;
$$;

-- Grant permission to call this function
GRANT EXECUTE ON FUNCTION debug_jwt_claims() TO authenticated;

-- Test the function (this will show NULL if not authenticated)
SELECT debug_jwt_claims(); 