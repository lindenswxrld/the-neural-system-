import type { Audit, AuditEvent } from "./schema";

const AUDITS = "neural_audits_v4";
const EVENTS = "neural_events_v4";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: app still works for this session */
  }
}

export const loadAudits = () => read<Audit>(AUDITS);
export const saveAudits = (a: Audit[]) => write(AUDITS, a);
export const loadEvents = () => read<AuditEvent>(EVENTS);
export const saveEvents = (e: AuditEvent[]) => write(EVENTS, e);
