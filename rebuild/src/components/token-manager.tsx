"use client";

import { useState } from "react";

type TokenInfo = { id: string; label: string; scopes: string[]; created_at: string; expires_at: string; revoked_at?: string };

export function TokenManager({ initialTokens }: { initialTokens: TokenInfo[] }) {
  const [tokens, setTokens] = useState(initialTokens);
  const [label, setLabel] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSecret("");
    try {
      const response = await fetch("/api/tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create token");
      setSecret(data.token); setLabel("");
      const list = await fetch("/api/tokens");
      if (list.ok) setTokens((await list.json()).tokens);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not create token"); }
    setBusy(false);
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this token? Any agent using it will lose access immediately.")) return;
    setError("");
    const response = await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    if (!response.ok) { setError("Could not revoke token"); return; }
    setTokens(tokens.map((token) => token.id === id ? { ...token, revoked_at: new Date().toISOString() } : token));
  }

  return <section className="token-panel"><div className="section-heading"><div><p className="kicker">For your agents</p><h2>API tokens</h2></div></div><p>Each token can create and immediately publish recipes as you. Tokens expire after 90 days. Copy a new token now—it is shown only once.</p>
    <form className="token-form" onSubmit={create}><label className="field">Token name<input value={label} onChange={(event) => setLabel(event.target.value)} minLength={2} maxLength={80} placeholder="My recipe agent" required /></label><button type="submit" className="button button-primary" disabled={busy}>{busy ? "Creating…" : "Create token"}</button></form>
    {error && <p className="form-error" role="alert">{error}</p>}
    {secret && <div className="token-secret" role="status"><strong>Copy your token now</strong><code>{secret}</code><button type="button" className="button" onClick={() => navigator.clipboard.writeText(secret)}>Copy</button></div>}
    <div className="token-list">{tokens.length ? tokens.map((token) => <div className="token-row" key={token.id}><div><strong>{token.label}</strong><span>{token.revoked_at ? "Revoked" : `Expires ${new Date(token.expires_at).toLocaleDateString()}`}</span></div>{!token.revoked_at && <button type="button" className="text-button remove" onClick={() => revoke(token.id)}>Revoke</button>}</div>) : <p>No tokens yet.</p>}</div>
  </section>;
}
