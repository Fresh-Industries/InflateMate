import "server-only";

import { prisma } from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";
import { createBusinessSchema, updateBusinessFormSchema } from "./business.schema";
import { publicBusinessSelect, privateBusinessSelect } from "./business.select";

const TAG = "business-data";
const REVALIDATE_SECONDS = 60 * 60 * 24;

// ---------- Cache helpers ----------
const getPublicCached = unstable_cache(
  async (businessId: string) => {
    return prisma.business.findUnique({
      where: { id: businessId },
      select: publicBusinessSelect,
    });
  },
  [TAG, "public"],
  { revalidate: REVALIDATE_SECONDS, tags: [TAG] }
);

const getPrivateCached = unstable_cache(
  async (businessId: string) => {
    return prisma.business.findUnique({
      where: { id: businessId },
      select: privateBusinessSelect,
    });
  },
  [TAG, "private"],
  { revalidate: REVALIDATE_SECONDS, tags: [TAG] }
);

// ----- exported server functions -----
export async function createBusinessForOrg(orgId: string, raw: unknown) {
  const data = createBusinessSchema.parse(raw);

  const business = await prisma.business.create({
    data: {
      ...data,
      organization: { connect: { id: orgId } },
      minNoticeHours: 24,
      maxNoticeHours: 2160,
      siteConfig: {},
    },
  });

  revalidateTag(TAG);
  return business;
}

export async function getBusinessByOrganizationId(orgId: string) {
  return prisma.business.findUnique({
    where: { organizationId: orgId },
    include: {
      organization: true,
      inventory: true,
      bookings: {
        where: { startTime: { gte: new Date() } },
        take: 5,
        orderBy: { startTime: "asc" },
      },
    },
  });
}

export async function getPublicBusinessByIdCached(businessId: string) {
  return getPublicCached(businessId);
}

export async function getPrivateBusinessByIdCached(businessId: string) {
  return getPrivateCached(businessId);
}

export async function updateBusinessFromFormData(businessId: string, formData: FormData) {
  const updateData: Record<string, unknown> = {};

  const textFields = ["name","description","email","phone","address","city","state","zipCode","logo"] as const;
  for (const f of textFields) {
    const v = formData.get(f);
    if (v !== null) updateData[f] = v.toString();
  }

  const numberFields = ["minNoticeHours","maxNoticeHours","minBookingAmount","bufferBeforeHours","bufferAfterHours"] as const;
  for (const f of numberFields) {
    const v = formData.get(f);
    if (v !== null && v !== "") updateData[f] = Number(v.toString());
  }

  const serviceAreas: string[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith("serviceArea[") && key.endsWith("]")) {
      serviceAreas.push(value.toString());
    }
  });
  if (serviceAreas.length) updateData.serviceArea = serviceAreas;

  const socialMediaStr = formData.get("socialMedia");
  if (socialMediaStr) {
    try {
      updateData.socialMedia = JSON.parse(socialMediaStr.toString());
    } catch {
      // ignore parse error; schema guard below
    }
  }

  const embedded = formData.get("embeddedComponents");
  if (embedded !== null) updateData.embeddedComponents = embedded.toString() === "true";

  updateBusinessFormSchema.parse(updateData);

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: updateData,
  });

  revalidateTag(TAG);
  return updated;
}
