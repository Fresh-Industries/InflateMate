// app/api/businesses/[businessId]/waivers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  const waivers = await prisma.waiver.findMany({
    where: { businessId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      booking: {
        select: {
          eventDate: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return NextResponse.json(waivers);
}