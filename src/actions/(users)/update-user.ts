import prisma from "@/lib/prisam-client";
import { auth } from "@clerk/nextjs/server";

export async function updateLastSeen() {
  const { userId } = await auth();

  if (!userId) return;

  await prisma.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
}