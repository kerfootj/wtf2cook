import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await context.params;
  const db = await getDb();
  const result = await db.collection("api_tokens").updateOne(
    { id, user_id: session.user.id, revoked_at: { $exists: false } },
    { $set: { revoked_at: new Date() } },
  );
  if (!result.matchedCount) return Response.json({ error: "Token not found" }, { status: 404 });
  return Response.json({ revoked: true });
}
