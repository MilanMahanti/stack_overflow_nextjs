/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload

  const eventType = evt.type;
  if (eventType === "user.created") {
    const mongoUser = await createUser({
      clerkId: evt.data.id,
      name: `${evt.data.first_name}${evt.data.last_name ? ` ${evt.data.last_name}` : ""}`,
      email: evt.data.email_addresses[0].email_address,
      username: evt.data.username!,
      picture: evt.data.image_url,
    });
    return NextResponse.json({ message: "Ok", user: mongoUser });
  }

  if (eventType === "user.updated") {
    const mongoUser = await updateUser({
      clerkId: evt.data.id,
      updateData: {
        name: `${evt.data.first_name}${evt.data.last_name ? ` ${evt.data.last_name}` : ""}`,
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username!,
        picture: evt.data.image_url,
      },
      path: `/profile/${evt.data.id}`,
    });
    return NextResponse.json({ message: "Ok", user: mongoUser });
  }
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    await deleteUser({ clerkId: id! });
    return NextResponse.json({ message: "Ok" });
  }
}
