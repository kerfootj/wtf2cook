import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions, googleConfigured } from "@/lib/auth";
import { AuthButtons } from "@/components/auth-buttons";
import { HeaderSearch } from "@/components/header-search";
import "./globals.css";

export const metadata: Metadata = {
  title: "WTF 2 Cook",
  description: "Good food for the days you don't know what to cook.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link className="wordmark" href="/" aria-label="WTF 2 Cook home">
              <svg className="brand-icon" viewBox="0 0 48 64" aria-hidden="true" focusable="false">
                <path className="brand-knife-blade" d="M18 2.5C13.5 8 9 14 9 18v20h6.5c0-3.5 1.5-5 4.5-5h2c-.2-12-1.5-24-4-30.5Z" />
                <path className="brand-knife-edge" d="M21.8 33C21.6 21 20.3 9 18 2.5" />
                <path className="brand-knife-bolster" d="M9 38h7.5v4H9Z" />
                <rect className="brand-tool-handle" x="9" y="42" width="8" height="19" rx="2" />
                <circle className="brand-tool-rivet" cx="13" cy="51" r=".8" />
                <g transform="translate(20 0) rotate(180 23 32) translate(-8 8) rotate(-90 32 24)">
                  <path className="brand-tool-handle" d="M5 30h17a3 3 0 0 1 3 3 3 3 0 0 1-3 3H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
                  <path className="brand-whisk-ferrule" d="M23 29h4v8h-4Z" />
                  <g className="brand-whisk-wires">
                    <path d="M27 33c11-9 23-10 29-6 6 2 6 10 0 12-6 4-18 3-29-6Z" />
                    <path d="M27 33c13-5 24-6 29-4 4 1 4 7 0 8-5 2-16 1-29-4Z" />
                    <path d="M27 33c14-2 25-3 29-2 3 1 3 3 0 4-4 1-15 0-29-2Z" />
                  </g>
                </g>
              </svg>
              <span className="brand-label">WTF <span className="brand-number">2</span> Cook</span>
            </Link>
            <Suspense fallback={<div className="header-search header-search-loading" aria-hidden="true" />}>
              <HeaderSearch />
            </Suspense>
            <nav aria-label="Main navigation" className="header-nav">
              {session?.user?.id
                ? <Link className="account-nav-link" href="/account" aria-label="Account" title="Account">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="8" r="3.25" />
                      <path d="M5.5 20c.3-3.5 2.7-5.4 6.5-5.4s6.2 1.9 6.5 5.4" />
                    </svg>
                  </Link>
                : <AuthButtons signedIn={false} configured={googleConfigured} />}
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer"><span>Made for hungry indecision.</span><span>WTF 2 Cook</span></footer>
      </body>
    </html>
  );
}
