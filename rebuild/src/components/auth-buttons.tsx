"use client";

import { signIn, signOut } from "next-auth/react";

export function AuthButtons({ signedIn, configured }: { signedIn: boolean; configured: boolean }) {
  if (signedIn) return <button type="button" className="nav-action" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>;
  if (!configured) return <span className="nav-muted" title="Add Google OAuth credentials to enable sign-in">Login not configured</span>;
  return <button type="button" className="nav-action google-sign-in" aria-label="Sign in with Google" onClick={() => signIn("google")}>
    <span className="google-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="var(--accent-blue)" d="M21.35 12.04c0-.64-.06-1.27-.18-1.87H12v3.54h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.15c1.84-1.7 2.9-4.2 2.9-7.05Z" />
        <path fill="var(--accent-purple)" d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.15-2.44c-.87.59-1.99.94-3.3.94-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.5Z" />
        <path fill="var(--accent-yellow)" d="M6.53 13.61A5.87 5.87 0 0 1 6.22 12c0-.56.1-1.1.31-1.61V7.87H3.28A9.75 9.75 0 0 0 2.25 12c0 1.56.37 3.03 1.03 4.13l3.25-2.52Z" />
        <path fill="var(--accent-sky)" d="M12 6.36c1.43 0 2.71.49 3.72 1.45l2.78-2.78A9.36 9.36 0 0 0 12 2.5a9.75 9.75 0 0 0-8.72 5.37l3.25 2.52C7.3 8.08 9.46 6.36 12 6.36Z" />
      </svg>
    </span>
    <span>Sign in</span>
  </button>;
}
