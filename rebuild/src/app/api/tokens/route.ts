import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureIndexes, getDb } from "@/lib/db";
import { issueToken } from "@/lib/tokens";
import type { ApiToken } from "@/lib/tokens";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  const db = await getDb();
  const tokens = await db.collection<ApiToken>("api_tokens")
    .find({ user_id: session.user.id }, { projection: { _id: 0, hash: 0 } })
    .sort({ created_at: -1 }).toArray();
  return Response.json({ tokens });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in required" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const label = (body as { label?: unknown })?.label;
  if (typeof label !== "string" || label.trim().length < 2 || label.length > 80) {
    return Response.json({ error: "Label must be 2–80 characters" }, { status: 400 });
  }
  await ensureIndexes();
  return Response.json(await issueToken(session.user.id, label), { status: 201 });
}
