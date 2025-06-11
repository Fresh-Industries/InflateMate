-- =============================================================================
-- SIMPLIFIED RLS SETUP FOR REALTIME COMPATIBILITY
-- =============================================================================
-- Run this in both Production and Development Supabase SQL Editor
-- This replaces ALL previous RLS configurations
-- =============================================================================

-- Step 1: Clean up all existing policies
-- =============================================================================
DROP POLICY IF EXISTS "Users can access bookings from their organization" ON "public"."Booking";
DROP POLICY IF EXISTS "Allow org members to select bookings" ON "public"."Booking";
DROP POLICY IF EXISTS "Users can access customers from their organization" ON "public"."Customer";
DROP POLICY IF EXISTS "Users can access waivers from their organization" ON "public"."Waiver";
DROP POLICY IF EXISTS "Allow org members to select waivers" ON "public"."Waiver";
DROP POLICY IF EXISTS "Users can access businesses from their organization" ON "public"."Business";
DROP POLICY IF EXISTS "Users can access inventory from their organization" ON "public"."Inventory";
DROP POLICY IF EXISTS "Users can access payments from their organization" ON "public"."Payment";
DROP POLICY IF EXISTS "Users can access coupons from their organization" ON "public"."Coupon";
DROP POLICY IF EXISTS "Users can access sales funnels from their organization" ON "public"."SalesFunnel";
DROP POLICY IF EXISTS "Users can access invoices from their organization" ON "public"."Invoice";
DROP POLICY IF EXISTS "Users can access quotes from their organization" ON "public"."Quote";
DROP POLICY IF EXISTS "Users can access customer stripe accounts from their organization" ON "public"."CustomerStripeAccount";
DROP POLICY IF EXISTS "Users can access booking items from their organization" ON "public"."BookingItem";
DROP POLICY IF EXISTS "Users can access their own record" ON "public"."User";
DROP POLICY IF EXISTS "Users can access their organization" ON "public"."Organization";
DROP POLICY IF EXISTS "Users can access memberships from their organization" ON "public"."Membership";
DROP POLICY IF EXISTS "Users can access their organization subscription" ON "public"."Subscription";

-- Remove any anonymous policies that might interfere
DROP POLICY IF EXISTS "Allow anonymous read bookings" ON "public"."Booking";
DROP POLICY IF EXISTS "Allow anonymous read customers" ON "public"."Customer";
DROP POLICY IF EXISTS "Allow anonymous read waivers" ON "public"."Waiver";

-- Step 2: Create helper functions for Clerk Third-Party Auth
-- =============================================================================
CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For Clerk Third-Party Auth session tokens, org ID is in jwt().o.id
  RETURN COALESCE(
    auth.jwt() -> 'o' ->> 'id',           -- Primary: Clerk session token format
    auth.jwt() ->> 'org_id'               -- Fallback: if direct org_id exists
  );
END;
$$;

-- Create function to check if user has access to a business
CREATE OR REPLACE FUNCTION auth.user_has_business_access(business_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_org_id TEXT;
BEGIN
  user_org_id := auth.get_user_organization_id();
  
  IF user_org_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 
    FROM "public"."Business" b
    JOIN "public"."Organization" o ON b."organizationId" = o.id
    WHERE b.id = business_id AND o."clerkOrgId" = user_org_id
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION auth.get_user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_has_business_access(TEXT) TO authenticated;

-- Step 3: Create debug function (optional)
-- =============================================================================
CREATE OR REPLACE FUNCTION debug_clerk_auth()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  jwt_payload json;
  clerk_org_id text;
BEGIN
  jwt_payload := auth.jwt();
  clerk_org_id := auth.get_user_organization_id();
  
  RETURN json_build_object(
    'has_jwt', jwt_payload IS NOT NULL,
    'user_id', jwt_payload ->> 'sub',
    'clerk_org_id', clerk_org_id,
    'org_from_o', jwt_payload -> 'o' ->> 'id',
    'org_direct', jwt_payload ->> 'org_id'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION debug_clerk_auth() TO authenticated;

-- Step 4: Enable RLS on all tables
-- =============================================================================
ALTER TABLE "public"."Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Waiver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Coupon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SalesFunnel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Quote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."CustomerStripeAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."BookingItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Subscription" ENABLE ROW LEVEL SECURITY;

-- Step 5: Create SIMPLIFIED RLS policies for REALTIME COMPATIBILITY
-- =============================================================================

-- Business table (direct organization mapping)
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

-- Booking table (SIMPLIFIED FOR REALTIME)
CREATE POLICY "Users can access bookings from their organization"
ON "public"."Booking"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Customer table
CREATE POLICY "Users can access customers from their organization"
ON "public"."Customer"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Waiver table (SIMPLIFIED FOR REALTIME)
CREATE POLICY "Users can access waivers from their organization"
ON "public"."Waiver"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Inventory table
CREATE POLICY "Users can access inventory from their organization"
ON "public"."Inventory"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Payment table
CREATE POLICY "Users can access payments from their organization"
ON "public"."Payment"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Coupon table
CREATE POLICY "Users can access coupons from their organization"
ON "public"."Coupon"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- SalesFunnel table
CREATE POLICY "Users can access sales funnels from their organization"
ON "public"."SalesFunnel"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Invoice table
CREATE POLICY "Users can access invoices from their organization"
ON "public"."Invoice"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- Quote table
CREATE POLICY "Users can access quotes from their organization"
ON "public"."Quote"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- CustomerStripeAccount table
CREATE POLICY "Users can access customer stripe accounts from their organization"
ON "public"."CustomerStripeAccount"
FOR ALL
TO authenticated
USING (auth.user_has_business_access("businessId"));

-- BookingItem table (access via Booking)
CREATE POLICY "Users can access booking items from their organization"
ON "public"."BookingItem"
FOR ALL
TO authenticated
USING (
  "bookingId" IN (
    SELECT bk.id 
    FROM "public"."Booking" bk
    WHERE auth.user_has_business_access(bk."businessId")
  )
);

-- Step 6: Create RLS policies - System Tables
-- =============================================================================

-- User table (users can only see their own record)
CREATE POLICY "Users can access their own record"
ON "public"."User"
FOR ALL
TO authenticated
USING ("clerkUserId" = (auth.jwt() ->> 'sub')::text);

-- Organization table (users can only see their organization)
CREATE POLICY "Users can access their organization"
ON "public"."Organization"
FOR ALL
TO authenticated
USING ("clerkOrgId" = auth.get_user_organization_id());

-- Membership table (users can see memberships for their organization)
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

-- Subscription table (users can see their organization's subscription)
CREATE POLICY "Users can access their organization subscription"
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

-- Step 7: Grant necessary permissions
-- =============================================================================
GRANT ALL ON "public"."Booking" TO authenticated;
GRANT ALL ON "public"."Customer" TO authenticated;
GRANT ALL ON "public"."Waiver" TO authenticated;
GRANT ALL ON "public"."Business" TO authenticated;
GRANT ALL ON "public"."Inventory" TO authenticated;
GRANT ALL ON "public"."Payment" TO authenticated;
GRANT ALL ON "public"."Coupon" TO authenticated;
GRANT ALL ON "public"."SalesFunnel" TO authenticated;
GRANT ALL ON "public"."Invoice" TO authenticated;
GRANT ALL ON "public"."Quote" TO authenticated;
GRANT ALL ON "public"."CustomerStripeAccount" TO authenticated;
GRANT ALL ON "public"."BookingItem" TO authenticated;
GRANT ALL ON "public"."User" TO authenticated;
GRANT ALL ON "public"."Organization" TO authenticated;
GRANT ALL ON "public"."Membership" TO authenticated;
GRANT ALL ON "public"."Subscription" TO authenticated;

-- Step 8: Verification
-- =============================================================================
SELECT 'Simplified RLS setup completed for realtime compatibility!' as status,
       'Run SELECT debug_clerk_auth(); to test your connection' as test_command,
       'Realtime should now work for Booking and Waiver tables' as realtime_status;