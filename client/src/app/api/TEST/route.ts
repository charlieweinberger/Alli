import { db } from "@/db/drizzle";
export async function GET() {
  const allUsers = await db.query.TEST.findMany();
  console.log(allUsers);
  return Response.json(allUsers);
}
