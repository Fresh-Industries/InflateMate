// lib/createBookingSafely.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";

// small wrapper to retry 3× on 23P01 (exclusion) or deadlock
export async fun
  maxRetries = 3,
) {
  let attempt = 0;
  // SERIALIZABLE gives the strongest guarantee   🔗 docs
  while (attempt < maxRetries) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          // 1. create Booking
          const booking = await tx.booking.create({ data: data });
          // 2. optionally do other stuff in the same tx
          return booking;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // retry only on exclusion_violation or deadlock
      if (
        ["23P01", "40001"].includes(err?.code) && // 40001 = serialization_failure
        attempt < maxRetries - 1
      ) {
        attempt++;
        continue;
      }
      throw err; // bubble anything else
    }
  }
}
