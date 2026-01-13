/**
 * Clerk webhook handler
 * Handles user events from Clerk for database synchronization
 */
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"

/**
 * POST /api/webhooks/clerk
 * Handle Clerk webhook events
 */
export async function POST(request: Request) {
  // Get webhook secret from environment
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not configured")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  // Get Svix headers for verification
  const headerPayload = await headers()
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers")
    return NextResponse.json(
      { error: "Missing webhook headers" },
      { status: 400 }
    )
  }

  // Get request body
  const payload = await request.json()
  const body = JSON.stringify(payload)

  // Verify webhook signature
  const wh = new Webhook(webhookSecret)
  let event: WebhookEvent

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch (error) {
    console.error("Webhook verification failed:", error)
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    )
  }

  // Handle different event types
  const eventType = event.type

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(event.data)
        break

      case "user.updated":
        await handleUserUpdated(event.data)
        break

      case "user.deleted":
        await handleUserDeleted(event.data)
        break

      default:
        console.log(`Unhandled webhook event: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error handling ${eventType}:`, error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(data: {
  id: string
  email_addresses?: Array<{ email_address: string }>
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  image_url?: string
}) {
  console.log("User created:", data.id)

  // In the future, this will create a user record in the database
  // For now with dummy data, we just log the event

  // Example of what this would do with a real database:
  // const db = getDb()
  // await db.users.create({
  //   clerk_user_id: data.id,
  //   email: data.email_addresses?.[0]?.email_address || '',
  //   username: data.username || generateUsername(),
  //   display_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
  //   avatar_url: data.image_url || null,
  // })
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(data: {
  id: string
  email_addresses?: Array<{ email_address: string }>
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  image_url?: string
}) {
  console.log("User updated:", data.id)

  // In the future, this will update the user record in the database
  // For now with dummy data, we just log the event
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(data: { id?: string }) {
  if (!data.id) {
    console.warn("User deleted event missing user ID")
    return
  }
  console.log("User deleted:", data.id)

  // In the future, this will soft-delete the user and their data
  // For now with dummy data, we just log the event
}
