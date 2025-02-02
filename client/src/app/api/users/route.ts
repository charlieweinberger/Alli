import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = await db.insert(users).values(body).returning();
  return NextResponse.json(newUser, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = id ? parseInt(id) : null;

  if (userId) {
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });
    return NextResponse.json(user);
  }
  const allUsers = await db.query.users.findMany();
  return NextResponse.json(allUsers);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
  const body = await request.json();
  const updatedUser = await db
    .update(users)
    .set(body)
    .where(eq(users.userId, userId))
    .returning();
  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id);
  const deletedUser = await db
    .delete(users)
    .where(eq(users.userId, userId))
    .returning();
  return NextResponse.json(deletedUser);
}
