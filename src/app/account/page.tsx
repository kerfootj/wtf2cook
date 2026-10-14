import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AuthButtons } from "@/components/auth-buttons";
import { getDb } from "@/lib/db";
import { TokenManager } from "@/components/token-manager";
import type { ApiToken } from "@/lib/tokens";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const db = await getDb();
  const tokens = await db.collection<ApiToken>("api_tokens").find(
    { user_id: session.user.id }, { projection: { _id: 0, hash: 0 } },
  ).sort({ created_at: -1 }).toArray();
  return <main className="page-shell account-shell">
    <div className="account-heading">
      <div><p className="kicker">Your account</p><h1>Hey, {session.user.name?.split(" ")[0] || "chef"}.</h1><p>{session.user.email}</p></div>
      <AuthButtons signedIn configured />
    </div>
    <TokenManager initialTokens={JSON.parse(JSON.stringify(tokens))} />
    <div className="api-hint"><h2>Agent quick start</h2><p>Send a <code>POST</code> request to <code>/api/v1/recipes</code> with <code>Authorization: Bearer &lt;token&gt;</code> and a JSON recipe. Include an <code>Idempotency-Key</code> when retrying requests.</p></div>
  </main>;
}
