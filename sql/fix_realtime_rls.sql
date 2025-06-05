-- Fix RLS and Realtime Setup for Booking Status Updates
-- This script ensures proper realtime updates for HOLD -> PENDING -> CONFIRMED transitions

-- 1. Ensure realtime is enabled for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."Booking";
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."Waiver";
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."BookingItem";

-- 2. Verify and fix RLS policies for Booking table
DROP POLICY IF EXISTS "Users can access bookings from their organization" ON "public"."Booking";

CREATE POLICY "Users can access bookings from their organization"
ON "public"."Booking"
FOR ALL
TO authenticated
USING (
  "businessId" IN (
    SELECT b.id 
    FROM "public"."Business" b
    INNER JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = COALESCE(
      auth.jwt() -> 'user_metadata' ->> 'organization_id',
      auth.jwt() -> 'o' ->> 'id',
      auth.jwt() ->> 'org_id'
    )
  )
);

-- 3. Verify and fix RLS policies for Waiver table
DROP POLICY IF EXISTS "Users can access waivers from their organization" ON "public"."Waiver";

CREATE POLICY "Users can access waivers from their organization"
ON "public"."Waiver"
FOR ALL
TO authenticated
USING (
  "bookingId" IN (
    SELECT bk.id 
    FROM "public"."Booking" bk
    INNER JOIN "public"."Business" b ON bk."businessId" = b.id
    INNER JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = COALESCE(
      auth.jwt() -> 'user_metadata' ->> 'organization_id',
      auth.jwt() -> 'o' ->> 'id',
      auth.jwt() ->> 'org_id'
    )
  )
);

-- 4. Verify and fix RLS policies for BookingItem table
DROP POLICY IF EXISTS "Users can access booking items from their organization" ON "public"."BookingItem";

CREATE POLICY "Users can access booking items from their organization"
ON "public"."BookingItem"
FOR ALL
TO authenticated
USING (
  "bookingId" IN (
    SELECT bk.id 
    FROM "public"."Booking" bk
    INNER JOIN "public"."Business" b ON bk."businessId" = b.id
    INNER JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = COALESCE(
      auth.jwt() -> 'user_metadata' ->> 'organization_id',
      auth.jwt() -> 'o' ->> 'id',
      auth.jwt() ->> 'org_id'
    )
  )
);

-- 5. Create a test function to verify JWT claims (for debugging)
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
    'org_id_direct', jwt_payload ->> 'org_id',
    'org_id_nested', jwt_payload -> 'o' ->> 'id',
    'org_id_user_metadata', jwt_payload -> 'user_metadata' ->> 'organization_id',
    'selected_org_id', COALESCE(
      jwt_payload -> 'user_metadata' ->> 'organization_id',
      jwt_payload -> 'o' ->> 'id',
      jwt_payload ->> 'org_id'
    ),
    'aud', jwt_payload ->> 'aud',
    'iss', jwt_payload ->> 'iss',
    'email', jwt_payload ->> 'email',
    'full_payload', jwt_payload
  );
END;
$$;

GRANT EXECUTE ON FUNCTION debug_jwt_claims() TO authenticated;

-- 6. Test query to verify access (run this after authentication)
-- SELECT debug_jwt_claims();
-- SELECT id, status, "businessId" FROM "public"."Booking" LIMIT 5;

SELECT 'RLS and Realtime setup completed successfully' as status; 