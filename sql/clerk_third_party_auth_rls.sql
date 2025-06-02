-- Clerk Third-Party Auth Integration RLS Setup
-- Copy and paste this entire script into Supabase SQL Editor to replace existing RLS

-- Step 1: Drop all existing policies to start clean
DROP POLICY IF EXISTS "Users can access bookings from their organization" ON "public"."Booking";
DROP POLICY IF EXISTS "Users can access customers from their organization" ON "public"."Customer";
DROP POLICY IF EXISTS "Users can access waivers from their organization" ON "public"."Waiver";
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

-- Drop anonymous policies that might interfere
DROP POLICY IF EXISTS "Allow anonymous read bookings" ON "public"."Booking";
DROP POLICY IF EXISTS "Allow anonymous read customers" ON "public"."Customer";
DROP POLICY IF EXISTS "Allow anonymous read waivers" ON "public"."Waiver";

-- Step 2: Create helper functions for Clerk Third-Party Auth JWT claims
CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use correct Clerk JWT claims path based on the actual JWT template
  RETURN COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'organization_id',
    auth.jwt() ->> 'org_id',
    auth.jwt() -> 'o' ->> 'id'
  );
END;
$$;

CREATE OR REPLACE FUNCTION auth.user_belongs_to_organization(org_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_org_id TEXT;
BEGIN
  user_org_id := auth.get_user_organization_id();
  RETURN user_org_id = org_id;
END;
$$;

-- Step 3: Enable RLS on all tables
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

-- Step 4: Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."Booking";
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."Customer";
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."Waiver";

-- Step 5: Create RLS policies for core business tables

-- Business table (users can only access their organization's businesses)
CREATE POLICY "Users can access businesses from their organization"
ON "public"."Business"
FOR ALL
TO authenticated
USING ("organizationId" = auth.get_user_organization_id());

-- Booking table
CREATE POLICY "Users can access bookings from their organization"
ON "public"."Booking"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Booking"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Customer table
CREATE POLICY "Users can access customers from their organization"
ON "public"."Customer"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Customer"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Waiver table
CREATE POLICY "Users can access waivers from their organization"
ON "public"."Waiver"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Waiver"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Inventory table
CREATE POLICY "Users can access inventory from their organization"
ON "public"."Inventory"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Inventory"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Payment table
CREATE POLICY "Users can access payments from their organization"
ON "public"."Payment"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Payment"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Coupon table
CREATE POLICY "Users can access coupons from their organization"
ON "public"."Coupon"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Coupon"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- SalesFunnel table
CREATE POLICY "Users can access sales funnels from their organization"
ON "public"."SalesFunnel"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "SalesFunnel"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Invoice table
CREATE POLICY "Users can access invoices from their organization"
ON "public"."Invoice"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Invoice"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Quote table
CREATE POLICY "Users can access quotes from their organization"
ON "public"."Quote"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "Quote"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- CustomerStripeAccount table
CREATE POLICY "Users can access customer stripe accounts from their organization"
ON "public"."CustomerStripeAccount"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Business" b
    WHERE b.id = "CustomerStripeAccount"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Step 6: Create RLS policies for related tables

-- BookingItem table (access via Booking)
CREATE POLICY "Users can access booking items from their organization"
ON "public"."BookingItem"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Booking" bk
    JOIN "public"."Business" b ON bk."businessId" = b.id
    WHERE bk.id = "BookingItem"."bookingId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Step 7: Create RLS policies for system/user tables

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
  EXISTS (
    SELECT 1 FROM "public"."Organization" o 
    WHERE o.id = "Membership"."organizationId"
    AND o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Subscription table (users can see their organization's subscription)
CREATE POLICY "Users can access their organization subscription"
ON "public"."Subscription"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Organization" o 
    WHERE o.id = "Subscription"."organizationId"
    AND o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Step 8: Grant necessary permissions to authenticated role
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

-- Step 9: Verify setup
SELECT 'RLS setup complete for Clerk Third-Party Auth integration' as status; 