import { db } from "@/db/drizzle";
import { connection } from "@/db/schema";
import { and, eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const existingConnections = await db.query.connection.findMany({
    where: and(
      eq(connection.user, body.user),
      eq(connection.responder, body.responder)
    ),
  });

  if (existingConnections.length > 0) {
    return NextResponse.json(
      { message: "Connection already exists" },
      { status: 400 }
    );
  }

  const newConnection = await db.insert(connection).values(body).returning();
  const body2 = {
    user: body.responder,
    responder: body.user,
  }
  await db.insert(connection).values(body2).returning();
  return NextResponse.json(newConnection, { status: 201 });
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const connectId = id ? parseInt(id) : null;

  if (connectId) {
    const conn = await db.query.connection.findMany({
      where: eq(connection.user, connectId),
    });
    return NextResponse.json(conn);
  }
  const allConnections = await db.query.connection.findMany();
  return NextResponse.json(allConnections);
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connectId = parseInt(params.id);
  const body = await request.json();
  const updatedConnection = await db
    .update(connection)
    .set(body)
    .where(eq(connection.connectId, connectId))
    .returning();
  return NextResponse.json(updatedConnection);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connectId = parseInt(params.id);
  const deletedConnection = await db
    .delete(connection)
    .where(eq(connection.connectId, connectId))
    .returning();
  return NextResponse.json(deletedConnection);
}
