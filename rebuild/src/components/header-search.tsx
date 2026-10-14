"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function HeaderSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = pathname === "/" ? searchParams.get("q") ?? "" : "";

  return (
    <search className="header-search">
      <form action="/" method="get">
        <input
          key={query}
          type="search"
          name="q"
          aria-label="Search recipes"
          placeholder="Search recipes"
          defaultValue={query}
        />
        <button type="submit" aria-label="Search" title="Search recipes">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="10.8" cy="10.8" r="6.6" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </button>
      </form>
    </search>
  );
}
