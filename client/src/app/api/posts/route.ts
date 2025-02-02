import { db } from "@/db/drizzle";
import { post } from "@/db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = { ...body, createdAt: new Date(body.createdAt) };
  console.log(parsedBody);
  const newPost = await db.insert(post).values(parsedBody).returning();

  return NextResponse.json(newPost, { status: 201 });
}

export async function GET() {
  const allPosts = await db.query.post.findMany();
  return NextResponse.json(allPosts);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id);
  const body = await request.json();
  const updatedPost = await db
    .update(post)
    .set(body)
    .where(eq(post.postId, postId))
    .returning();
  return NextResponse.json(updatedPost);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id);
  const deletedPost = await db
    .delete(post)
    .where(eq(post.postId, postId))
    .returning();
  return NextResponse.json(deletedPost);
}
