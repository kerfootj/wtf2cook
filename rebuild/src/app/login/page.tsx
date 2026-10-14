import { googleConfigured } from "@/lib/auth";
import { AuthButtons } from "@/components/auth-buttons";

export default function LoginPage() {
  return <main className="page-shell login-shell"><div className="login-card"><span className="login-symbol">✳</span><p className="kicker">Your kitchen, your recipes</p><h1>Come on in.</h1><p>Sign in with Google to add recipes, edit your collection, and create agent API tokens.</p><AuthButtons signedIn={false} configured={googleConfigured} />{!googleConfigured && <p className="setup-note">Google OAuth credentials are missing in this environment.</p>}</div></main>;
}
