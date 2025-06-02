-- RLS policies for system/user tables

-- User table (users can only see their own record)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their own record" ON "User";
CREATE POLICY "Users can access their own record" ON "User"
FOR ALL TO authenticated USING (
  "clerkUserId" = (auth.jwt() ->> 'sub')::text
);

-- Organization table (users can only see their organization)
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their organization" ON "Organization";
CREATE POLICY "Users can access their organization" ON "Organization"
FOR ALL TO authenticated USING (
  "clerkOrgId" = auth.get_user_organization_id()
);

-- Membership table (users can see memberships for their organization)
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access memberships from their organization" ON "Membership";
CREATE POLICY "Users can access memberships from their organization" ON "Membership"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Organization" o 
    WHERE o.id = "Membership"."organizationId"
    AND o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Subscription table (users can see their organization's subscription)
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access their organization subscription" ON "Subscription";
CREATE POLICY "Users can access their organization subscription" ON "Subscription"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Organization" o 
    WHERE o.id = "Subscription"."organizationId"
    AND o."clerkOrgId" = auth.get_user_organization_id()
  )
);

-- Grant permissions to authenticated role
GRANT ALL ON "User" TO authenticated;
GRANT ALL ON "Organization" TO authenticated;
GRANT ALL ON "Membership" TO authenticated;
GRANT ALL ON "Subscription" TO authenticated; 