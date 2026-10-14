type ActionIconKind = "add" | "edit" | "save";

export function ActionIcon({ kind }: { kind: ActionIconKind }) {
  return (
    <svg className={`button-icon button-icon--${kind}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "add" && <path d="M12 5v14M5 12h14" />}
      {kind === "edit" && <><path d="m4 20 4.7-1.2L19.2 8.3a2.1 2.1 0 0 0-3-3L5.7 15.8 4 20Z" /><path d="m14.6 7 3.4 3.4M5.7 15.8l3 3" /></>}
      {kind === "save" && <><path d="M4 3h13l3 3v15H4Z" /><path d="M7 3v6h10V3M7 21v-8h10v8M14 3v4" /></>}
    </svg>
  );
}
