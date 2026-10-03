import type { AuditEvent } from "@/lib/schema";
import { Label, Panel } from "./ui";

export function AuditLog({ events }: { events: AuditEvent[] }) {
  return (
    <Panel className="space-y-4">
      <Label>Activity log ({events.length})</Label>
      {events.length === 0 ? (
        <p className="text-sm text-muted">No activity recorded yet.</p>
      ) : (
        <ul className="divide-y divide-line text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap justify-between gap-2 py-3">
              <span>{e.action}{e.subject && <span className="text-muted"> · {e.subject}</span>}</span>
              <time className="font-mono text-xs text-muted">{new Date(e.at).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted">Stored in this browser. Server-side, tamper-resistant logging is the next step for enterprise use.</p>
    </Panel>
  );
}
