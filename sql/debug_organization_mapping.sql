-- Debug organization mapping based on actual schema
-- Organization has Business (1:1 relationship)
-- Business belongs to Organization via organizationId

-- Check Organizations table
SELECT 'Organizations in database:' as debug_info;
SELECT id, "clerkOrgId", name, "createdAt" FROM "Organization" ORDER BY "createdAt" DESC;

-- Check Business table 
SELECT 'Businesses in database:' as debug_info;
SELECT id, name, "organizationId", "createdAt" FROM "Business" ORDER BY "createdAt" DESC;

-- Check if there's a Business linked to your Clerk org
SELECT 'Business linked to your Clerk org:' as debug_info;
SELECT 
  o.id as org_db_id,
  o."clerkOrgId",
  o.name as org_name,
  b.id as business_id,
  b.name as business_name,
  b."organizationId"
FROM "Organization" o
LEFT JOIN "Business" b ON b."organizationId" = o.id
WHERE o."clerkOrgId" = 'org_2xeO9pruAIT6RZAXBSsl8xZh3Qs';

-- Check all org/business relationships
SELECT 'All org/business relationships:' as debug_info;
SELECT 
  o."clerkOrgId",
  o.name as org_name,
  b.name as business_name,
  b.id as business_id,
  b."organizationId"
FROM "Organization" o
LEFT JOIN "Business" b ON b."organizationId" = o.id
ORDER BY o."createdAt" DESC;

-- Debug: What businessId do your waivers have?
SELECT 'Waiver business IDs:' as debug_info;
SELECT DISTINCT "businessId" FROM "Waiver";

-- Check if waivers business exists and its org
SELECT 'Waiver business organization check:' as debug_info;
SELECT 
  w."businessId",
  b.name as business_name,
  b."organizationId",
  o."clerkOrgId"
FROM "Waiver" w
JOIN "Business" b ON w."businessId" = b.id
JOIN "Organization" o ON b."organizationId" = o.id
GROUP BY w."businessId", b.name, b."organizationId", o."clerkOrgId"; 