import { db } from "@/db/drizzle";
import { connection } from "@/db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const newConnection = await db.insert(connection).values(body).returning();
  return NextResponse.json(newConnection, { status: 201 });
}
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (params?.id) {
    const connectId = parseInt(params.id);
    const conn = await db.query.connection.findFirst({
      where: eq(connection.connectId, connectId),
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
