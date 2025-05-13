import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        businessId: businessId,
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

