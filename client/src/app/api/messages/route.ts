import { db } from "@/db/drizzle";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const newMessage = await db.insert(messages).values(body).returning();
  return NextResponse.json(newMessage, { status: 201 });
}
export async function GET() {
  const allMessages = await db.query.messages.findMany();
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const messageId = parseInt(params.id);
    const deletedMessage = await db
      .delete(messages)
      .where(eq(messages.id, messageId))
      .returning();
    return NextResponse.json(deletedMessage);
  }