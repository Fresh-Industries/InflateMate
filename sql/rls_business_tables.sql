-- Clerk JWT helper functions for organization-based access
CREATE OR REPLACE FUNCTION auth.get_user_organization_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use standard Clerk JWT claims for Third-Party Auth integration
  RETURN COALESCE(
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

-- RLS policies for core business tables (direct businessId)

-- Inventory table
ALTER TABLE "Inventory" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access inventory from their organization" ON "Inventory";
CREATE POLICY "Users can access inventory from their organization" ON "Inventory"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Inventory"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Customer table  
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access customers from their organization" ON "Customer";
CREATE POLICY "Users can access customers from their organization" ON "Customer"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Customer"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Booking table
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access bookings from their organization" ON "Booking";
CREATE POLICY "Users can access bookings from their organization" ON "Booking"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Booking"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Payment table
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access payments from their organization" ON "Payment";
CREATE POLICY "Users can access payments from their organization" ON "Payment"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Payment"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Coupon table
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access coupons from their organization" ON "Coupon";
CREATE POLICY "Users can access coupons from their organization" ON "Coupon"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Coupon"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- SalesFunnel table
ALTER TABLE "SalesFunnel" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access sales funnels from their organization" ON "SalesFunnel";
CREATE POLICY "Users can access sales funnels from their organization" ON "SalesFunnel"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "SalesFunnel"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Waiver table
ALTER TABLE "Waiver" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access waivers from their organization" ON "Waiver";
CREATE POLICY "Users can access waivers from their organization" ON "Waiver"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Waiver"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Invoice table
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access invoices from their organization" ON "Invoice";
CREATE POLICY "Users can access invoices from their organization" ON "Invoice"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Invoice"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Quote table
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access quotes from their organization" ON "Quote";
CREATE POLICY "Users can access quotes from their organization" ON "Quote"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "Quote"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- CustomerStripeAccount table
ALTER TABLE "CustomerStripeAccount" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access customer stripe accounts from their organization" ON "CustomerStripeAccount";
CREATE POLICY "Users can access customer stripe accounts from their organization" ON "CustomerStripeAccount"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Business" b
    WHERE b.id = "CustomerStripeAccount"."businessId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Business table
ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access businesses from their organization" ON "Business";
CREATE POLICY "Users can access businesses from their organization" ON "Business"
FOR ALL TO authenticated USING (
  "organizationId" = auth.get_user_organization_id()
);

-- Grant permissions to authenticated role
GRANT ALL ON "Inventory" TO authenticated;
GRANT ALL ON "Customer" TO authenticated;
GRANT ALL ON "Booking" TO authenticated;
GRANT ALL ON "Payment" TO authenticated;
GRANT ALL ON "Coupon" TO authenticated;
GRANT ALL ON "SalesFunnel" TO authenticated;
GRANT ALL ON "Waiver" TO authenticated;
GRANT ALL ON "Invoice" TO authenticated;
GRANT ALL ON "Quote" TO authenticated;
GRANT ALL ON "CustomerStripeAccount" TO authenticated;
GRANT ALL ON "Business" TO authenticated; 