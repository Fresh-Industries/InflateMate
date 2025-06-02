-- Fix Business RLS policies to properly map Clerk org ID to database org ID
-- The issue: Business.organizationId is a database ID, but auth.get_user_organization_id() returns Clerk ID

-- Drop and recreate Business RLS policy with proper organization lookup
DROP POLICY IF EXISTS "Users can access businesses from their organization" ON "public"."Business";

CREATE POLICY "Users can access businesses from their organization"
ON "public"."Business"
FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT o.id 
    FROM "public"."Organization" o 
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Also fix all other business-related RLS policies that have the same issue

-- Fix Booking RLS policy
DROP POLICY IF EXISTS "Users can access bookings from their organization" ON "public"."Booking";
CREATE POLICY "Users can access bookings from their organization"
ON "public"."Booking"
FOR ALL
TO authenticated
USING (
  "businessId" IN (
    SELECT b.id 
    FROM "public"."Business" b
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Fix Customer RLS policy  
DROP POLICY IF EXISTS "Users can access customers from their organization" ON "public"."Customer";
CREATE POLICY "Users can access customers from their organization"
ON "public"."Customer"
FOR ALL
TO authenticated
USING (
  "businessId" IN (
    SELECT b.id 
    FROM "public"."Business" b
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Fix Waiver RLS policy
DROP POLICY IF EXISTS "Users can access waivers from their organization" ON "public"."Waiver";
CREATE POLICY "Users can access waivers from their organization"
ON "public"."Waiver"
FOR ALL
TO authenticated
USING (
  "businessId" IN (
    SELECT b.id 
    FROM "public"."Business" b
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Fix Inventory RLS policy
DROP POLICY IF EXISTS "Users can access inventory from their organization" ON "public"."Inventory";
CREATE POLICY "Users can access inventory from their organization"
ON "public"."Inventory"
FOR ALL
TO authenticated
USING (
  "businessId" IN (
    SELECT b.id 
    FROM "public"."Business" b
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Fix Organization RLS policy (this one was already correct)
DROP POLICY IF EXISTS "Users can access their organization" ON "public"."Organization";
CREATE POLICY "Users can access their organization"
ON "public"."Organization"
FOR ALL
TO authenticated
USING ("clerkOrgId" = auth.get_user_organization_id());

SELECT 'Business RLS policies updated to properly map Clerk org ID to database org ID' as status; 