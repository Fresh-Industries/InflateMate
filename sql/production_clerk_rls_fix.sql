-- Production RLS Fix for Clerk Third-Party Auth Integration
-- Run this in your production Supabase SQL Editor
-- This fixes waiver notifications and all other RLS issues with Clerk session tokens

-- =============================================================================
-- STEP 1: Fix the RLS function to read Clerk session tokens correctly
-- =============================================================================

-- The auth.get_user_organization_id() function needs to look in jwt().o.id
-- instead of jwt().org_id for Clerk session tokens
CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For Clerk session tokens, org ID is nested in 'o' object
  RETURN COALESCE(
    auth.jwt() -> 'o' ->> 'id',           -- Primary: o.id (Clerk format)
    auth.jwt() ->> 'org_id'               -- Fallback: direct org_id
  );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION auth.get_user_organization_id() TO authenticated;

-- =============================================================================
-- STEP 2: Fix Business RLS policy to map Clerk org ID to database org ID
-- =============================================================================

-- The main issue: Business.organizationId contains database UUIDs, 
-- but auth.get_user_organization_id() returns Clerk org IDs
-- We need to map through the Organization table

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

-- =============================================================================
-- STEP 3: Fix all related RLS policies with the same mapping issue
-- =============================================================================

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

-- Fix Waiver RLS policy (THIS IS THE KEY ONE FOR NOTIFICATIONS)
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

-- Fix BookingItem RLS policy
DROP POLICY IF EXISTS "Users can access booking items from their organization" ON "public"."BookingItem";
CREATE POLICY "Users can access booking items from their organization"
ON "public"."BookingItem"
FOR ALL
TO authenticated
USING (
  "bookingId" IN (
    SELECT bk.id 
    FROM "public"."Booking" bk
    JOIN "public"."Business" b ON bk."businessId" = b.id
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Fix Payment RLS policy
DROP POLICY IF EXISTS "Users can access payments from their organization" ON "public"."Payment";
CREATE POLICY "Users can access payments from their organization"
ON "public"."Payment"
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

-- Fix Quote RLS policy
DROP POLICY IF EXISTS "Users can access quotes from their organization" ON "public"."Quote";
CREATE POLICY "Users can access quotes from their organization"
ON "public"."Quote"
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

-- Fix Invoice RLS policy
DROP POLICY IF EXISTS "Users can access invoices from their organization" ON "public"."Invoice";
CREATE POLICY "Users can access invoices from their organization"
ON "public"."Invoice"
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

-- Fix Coupon RLS policy
DROP POLICY IF EXISTS "Users can access coupons from their organization" ON "public"."Coupon";
CREATE POLICY "Users can access coupons from their organization"
ON "public"."Coupon"
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

-- Fix Organization RLS policy (this one was already correct but ensuring it's there)
DROP POLICY IF EXISTS "Users can access their organization" ON "public"."Organization";
CREATE POLICY "Users can access their organization"
ON "public"."Organization"
FOR ALL
TO authenticated
USING ("clerkOrgId" = auth.get_user_organization_id());

-- =============================================================================
-- STEP 4: Add any missing RLS policies for completeness
-- =============================================================================

-- SalesFunnel RLS policy
DROP POLICY IF EXISTS "Users can access sales funnels from their organization" ON "public"."SalesFunnel";
CREATE POLICY "Users can access sales funnels from their organization"
ON "public"."SalesFunnel"
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

-- Membership RLS policy (if it exists)
DROP POLICY IF EXISTS "Users can access memberships from their organization" ON "public"."Membership";
CREATE POLICY "Users can access memberships from their organization"
ON "public"."Membership"
FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT o.id 
    FROM "public"."Organization" o 
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Subscription RLS policy (if it exists)
DROP POLICY IF EXISTS "Users can access subscriptions from their organization" ON "public"."Subscription";
CREATE POLICY "Users can access subscriptions from their organization"
ON "public"."Subscription"
FOR ALL
TO authenticated
USING (
  "organizationId" IN (
    SELECT o.id 
    FROM "public"."Organization" o 
    WHERE o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- =============================================================================
-- STEP 5: Verification - Create test function (optional)
-- =============================================================================

-- Optional: Create a test function to verify the fix worked
CREATE OR REPLACE FUNCTION test_clerk_rls_fix()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'clerk_org_id', auth.get_user_organization_id(),
    'has_business_access', EXISTS(
      SELECT 1 FROM "public"."Business" 
      WHERE "organizationId" IN (
        SELECT o.id 
        FROM "public"."Organization" o 
        WHERE o."clerkOrgId" = auth.get_user_organization_id()
      )
    ),
    'business_count', (
      SELECT COUNT(*) FROM "public"."Business" 
      WHERE "organizationId" IN (
        SELECT o.id 
        FROM "public"."Organization" o 
        WHERE o."clerkOrgId" = auth.get_user_organization_id()
      )
    ),
    'waiver_count', (
      SELECT COUNT(*) FROM "public"."Waiver" 
      WHERE "businessId" IN (
        SELECT b.id 
        FROM "public"."Business" b
        JOIN "public"."Organization" o ON b."organizationId" = o.id
        WHERE o."clerkOrgId" = auth.get_user_organization_id()
      )
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION test_clerk_rls_fix() TO authenticated;

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

SELECT 'Production Clerk RLS fix completed successfully!' as status,
       'Waiver notifications should now work consistently' as note,
       'Test your waiver signing workflow to verify' as next_step; 