import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-xs uppercase tracking-widest text-muted">{children}</p>;
}

export function Meter({ label, value, tone = "accent" }: { label: string; value: number; tone?: "accent" | "danger" }) {
  const color = tone === "danger" ? "var(--color-danger)" : "var(--color-accent)";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-1 w-full bg-line">
        <div className="h-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-line bg-surface p-6 ${className}`}>{children}</section>;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-accent px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40 ${props.className ?? ""}`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`border border-line px-4 py-2 text-sm text-muted transition hover:border-muted hover:text-fg ${props.className ?? ""}`}
    />
  );
}
