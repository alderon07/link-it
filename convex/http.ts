import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

/**
 * Clerk webhook handler
 * Handles user lifecycle events from Clerk
 */
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get Svix headers for verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing Svix headers");
      return new Response(
        JSON.stringify({ error: "Missing webhook headers" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get request body
    const body = await request.text();

    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    let event: {
      type: string;
      data: {
        id: string;
        email_addresses?: Array<{ email_address: string }>;
        username?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string;
      };
    };

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as typeof event;
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle different event types
    const eventType = event.type;

    try {
      switch (eventType) {
        case "user.created":
          await ctx.runMutation(internal.users.internal.createFromClerk, {
            clerkUserId: event.data.id,
            email: event.data.email_addresses?.[0]?.email_address || "",
            username: event.data.username || undefined,
            firstName: event.data.first_name || undefined,
            lastName: event.data.last_name || undefined,
            imageUrl: event.data.image_url,
          });
          console.log("User created:", event.data.id);
          break;

        case "user.updated":
          await ctx.runMutation(internal.users.internal.updateFromClerk, {
            clerkUserId: event.data.id,
            email: event.data.email_addresses?.[0]?.email_address,
            username: event.data.username || undefined,
            firstName: event.data.first_name || undefined,
            lastName: event.data.last_name || undefined,
            imageUrl: event.data.image_url,
          });
          console.log("User updated:", event.data.id);
          break;

        case "user.deleted":
          if (event.data.id) {
            await ctx.runMutation(internal.users.internal.deleteFromClerk, {
              clerkUserId: event.data.id,
            });
            console.log("User deleted:", event.data.id);
          }
          break;

        default:
          console.log(`Unhandled webhook event: ${eventType}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(`Error handling ${eventType}:`, error);
      return new Response(
        JSON.stringify({ error: "Failed to process webhook" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
