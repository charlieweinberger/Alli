import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const newMessage = await db.insert(messages).values(body).returning();
  return NextResponse.json(newMessage, { status: 201 });
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentUserID = searchParams.get("currentUserID");
  const respondingTo = searchParams.get("respondingTo");

  let allMessages;

  if (currentUserID && respondingTo) {
    allMessages = await db.query.messages.findMany({
      where: (messages, { and, or, eq }) =>
        and(
          or(
            eq(messages.senderId, parseInt(currentUserID)),
            eq(messages.receiverId, parseInt(respondingTo))
          ),
          or(
            eq(messages.receiverId, parseInt(currentUserID)),
            eq(messages.senderId, parseInt(respondingTo))
          )
        ),
    });
  } else {
    allMessages = await db.query.messages.findMany();
  }

  return NextResponse.json(allMessages);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const messageId = parseInt(params.id);
  const body = await request.json();
  const updatedMessage = await db
    .update(messages)
    .set(body)
    .where(eq(messages.id, messageId))
    .returning();
  return NextResponse.json(updatedMessage);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const messageId = parseInt(params.id);
  const deletedMessage = await db
    .delete(messages)
    .where(eq(messages.id, messageId))
    .returning();
  return NextResponse.json(deletedMessage);
}
