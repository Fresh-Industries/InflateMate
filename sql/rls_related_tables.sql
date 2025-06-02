-- RLS policies for tables that access business data via relationships

-- BookingItem table (access via Booking)
ALTER TABLE "BookingItem" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can access booking items from their organization" ON "BookingItem";
CREATE POLICY "Users can access booking items from their organization" ON "BookingItem"
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM "Booking" bk
    JOIN "Business" b ON bk."businessId" = b.id
    WHERE bk.id = "BookingItem"."bookingId"
    AND b."organizationId" = auth.get_user_organization_id()
  )
);

-- Grant permissions to authenticated role
GRANT ALL ON "BookingItem" TO authenticated; 