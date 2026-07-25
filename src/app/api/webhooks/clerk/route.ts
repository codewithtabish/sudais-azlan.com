// src/app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisam-client";

export async function POST(req: Request) {
  console.log("========================================");
  console.log("🔔 WEBHOOK POST HIT at:", new Date().toISOString());

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ MISSING CLERK_WEBHOOK_SIGNING_SECRET");
    return new Response("Missing CLERK_WEBHOOK_SIGNING_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  console.log("📨 Svix headers:", {
    svixId,
    svixTimestamp,
    svixSignature: svixSignature?.slice(0, 20) + "...",
  });

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.log("❌ Missing Svix headers");
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();
  console.log("📦 Payload length:", payload.length);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
    console.log("✅ Webhook verified, event type:", evt.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  const eventType = evt.type;
  console.log("🎯 Handling event:", eventType);

  try {
    switch (eventType) {
      case "user.created": {
        const data = evt.data;
        console.log("👤 User created:", data.id);

        const email =
          data.email_addresses?.find(
            (email) => email.id === data.primary_email_address_id
          )?.email_address ??
          data.email_addresses?.[0]?.email_address ??
          "";

        // Create user in DB. lastLoginAt is intentionally omitted here —
        // session.created will set it when the user actually logs in.
        const result = await prisma.user.upsert({
          where: { clerkId: data.id },
          update: {}, // Safety fallback, shouldn't happen on create
          create: {
            clerkId: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email,
            imageUrl: data.image_url,
            role: "USER",
          },
        });

        console.log("✅ User created in DB:", result);
        break;
      }

      case "user.updated": {
        const data = evt.data;
        console.log("👤 User updated:", data.id);

        const email =
          data.email_addresses?.find(
            (email) => email.id === data.primary_email_address_id
          )?.email_address ??
          data.email_addresses?.[0]?.email_address ??
          "";

        // NOTE: lastLoginAt is INTENTIONALLY omitted here.
        // user.updated fires on profile changes (name, email, image),
        // NOT on login. Changing your profile pic should NOT update lastLoginAt.
        const result = await prisma.user.updateMany({
          where: { clerkId: data.id },
          data: {
            firstName: data.first_name,
            lastName: data.last_name,
            email,
            imageUrl: data.image_url,
          },
        });

        console.log("✅ User updated in DB, count:", result.count);
        break;
      }

      // 🔥 THIS fires EVERY time the user logs in (new session)
      case "session.created": {
        const data = evt.data as { user_id: string };
        console.log("🔑 Session created (login) for user:", data.user_id);

        if (data.user_id) {
          const result = await prisma.user.updateMany({
            where: { clerkId: data.user_id },
            data: {
              lastLoginAt: new Date(),
              lastSeenAt: new Date(),
            },
          });
          console.log("✅ Updated lastLoginAt & lastSeenAt, count:", result.count);
        }
        break;
      }

      case "user.deleted": {
        const data = evt.data;
        console.log("🗑️ Deleting user:", data.id);

        if (data.id) {
          const result = await prisma.user.deleteMany({
            where: { clerkId: data.id },
          });
          console.log("✅ Deleted count:", result.count);
        }
        break;
      }

      default:
        console.log("⚠️ Unhandled event type:", eventType);
        break;
    }

    console.log("✅ Webhook processed successfully");
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌❌❌ CLERK WEBHOOK ERROR:", error);
    console.error("Error stack:", (error as Error).stack);
    return new Response("Webhook Error: " + (error as Error).message, {
      status: 500,
    });
  }
}