"use client";

import { useEffect, useState } from "react";
import { Landing } from "@/components/neural/landing";
import { Assessment } from "@/components/neural/assessment";
import { Retention } from "@/components/neural/retention";
import { AuditLog } from "@/components/neural/audit-log";
import { loadAudits, loadEvents, saveAudits, saveEvents } from "@/lib/storage";
import type { Audit, AuditEvent } from "@/lib/schema";

type Module = "assessments" | "retention" | "activity";

const NAV: { id: Module | "engagement" | "risk"; label: string; ready: boolean }[] = [
  { id: "assessments", label: "Assessments", ready: true },
  { id: "retention", label: "Retention", ready: true },
  { id: "engagement", label: "Engagement", ready: false },
  { id: "risk", label: "Manager risk", ready: false },
  { id: "activity", label: "Activity log", ready: true },
];

export default function Page() {
  const [entered, setEntered] = useState(false);
  const [module, setModule] = useState<Module>("assessments");
  const [audits, setAudits] = useState<Audit[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    // Load after mount so server and client markup match (localStorage is client-only).
    /* eslint-disable react-hooks/set-state-in-effect */
    setAudits(loadAudits());
    setEvents(loadEvents());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function logEvent(action: string, subject?: string) {
    setEvents((prev) => {
      const next = [{ id: crypto.randomUUID(), at: new Date().toISOString(), action, subject }, ...prev].slice(0, 200);
      saveEvents(next);
      return next;
    });
  }

  function saveAudit(a: Audit) {
    setAudits((prev) => {
      const next = [a, ...prev].slice(0, 25);
      saveAudits(next);
      return next;
    });
  }

  if (!entered) return <Landing onEnter={() => setEntered(true)} />;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="no-print flex shrink-0 flex-col gap-8 border-b border-line p-6 md:w-64 md:border-b-0 md:border-r">
        <button onClick={() => setEntered(false)} className="flex items-center gap-3 text-left">
          <span className="h-3 w-3 bg-accent" aria-hidden />
          <span className="text-sm font-medium">The Neural System</span>
        </button>
        <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Modules">
          {NAV.map((n) => (
            <button
              key={n.id}
              disabled={!n.ready}
              onClick={() => n.ready && setModule(n.id as Module)}
              aria-current={module === n.id ? "page" : undefined}
              className={`flex items-center justify-between whitespace-nowrap px-3 py-2 text-left text-sm transition ${
                module === n.id ? "bg-accent text-black" : n.ready ? "text-muted hover:text-fg" : "cursor-not-allowed text-muted/40"
              }`}
            >
              {n.label}
              {!n.ready && <span className="ml-3 text-[10px] uppercase tracking-wider">Soon</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <h1 className="no-print mb-8 text-3xl font-semibold tracking-tight">
          {NAV.find((n) => n.id === module)?.label}
        </h1>
        {module === "assessments" && <Assessment audits={audits} onSave={saveAudit} onEvent={logEvent} />}
        {module === "retention" && <Retention onEvent={logEvent} />}
        {module === "activity" && <AuditLog events={events} />}
      </main>
    </div>
  );
}
