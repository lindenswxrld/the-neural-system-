"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";
import { analyzePerformance, compareCandidates } from "@/app/actions";
import type { Audit } from "@/lib/schema";
import { GhostButton, Label, Meter, Panel, PrimaryButton } from "./ui";

type Props = {
  audits: Audit[];
  onSave: (a: Audit) => void;
  onEvent: (action: string, subject?: string) => void;
};

const TRAITS = [
  ["openness", "Openness"],
  ["conscientiousness", "Conscientiousness"],
  ["extraversion", "Extraversion"],
  ["agreeableness", "Agreeableness"],
  ["neuroticism", "Neuroticism"],
] as const;

export function Assessment({ audits, onSave, onEvent }: Props) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareText, setCompareText] = useState("");
  const [comparing, setComparing] = useState(false);

  const current = audits.find((a) => a.id === currentId) ?? audits[0] ?? null;
  const pair = compare.map((id) => audits.find((a) => a.id === id)).filter(Boolean) as Audit[];

  async function run() {
    if (!name.trim()) return setError("Enter a candidate identifier.");
    setError("");
    setBusy(true);
    const res = await analyzePerformance(text);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    const audit: Audit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      analysis: res.data,
    };
    onSave(audit);
    onEvent("Assessment completed", audit.name);
    setCurrentId(audit.id);
    setCompare([]);
    setName("");
    setText("");
  }

  async function toggleCompare(a: Audit) {
    setCompareText("");
    if (compare.includes(a.id)) return setCompare(compare.filter((x) => x !== a.id));
    if (compare.length >= 2) return;
    const next = [...compare, a.id];
    setCompare(next);
    if (next.length === 2) {
      const [x, y] = next.map((id) => audits.find((q) => q.id === id)!);
      setComparing(true);
      const res = await compareCandidates(x.analysis, y.analysis);
      setComparing(false);
      setCompareText(res.ok ? res.data : res.error);
      onEvent("Comparison generated", `${x.name} / ${y.name}`);
    }
  }

  function exportReport() {
    if (!current) return;
    onEvent("Report exported", current.name);
    window.print();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="no-print space-y-8 lg:col-span-4">
        <div className="space-y-4">
          <label className="block space-y-2">
            <Label>Candidate identifier</Label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Candidate 014"
              className="w-full border border-line bg-surface p-3 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="block space-y-2">
            <Label>Behavioural data</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste interview notes, a self-description, or a performance narrative. More specific detail gives a more reliable result."
              className="h-48 w-full resize-none border border-line bg-surface p-3 text-sm leading-relaxed outline-none focus:border-accent"
            />
          </label>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <PrimaryButton onClick={run} disabled={busy} className="w-full">
            {busy ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Run assessment"}
          </PrimaryButton>
          <p className="text-xs leading-relaxed text-muted">
            AI-generated indicators from text. Not a validated psychometric instrument; do not use as the
            sole basis for an employment decision. Profiles are stored in this browser only.
          </p>
        </div>

        <div className="space-y-3 border-t border-line pt-6">
          <Label>Registry ({audits.length})</Label>
          {audits.length === 0 && <p className="text-sm text-muted">No assessments yet.</p>}
          {audits.map((a) => (
            <div key={a.id} className="flex gap-2">
              <button
                onClick={() => { setCurrentId(a.id); setCompare([]); setCompareText(""); }}
                className={`flex-1 border p-3 text-left text-sm transition ${current?.id === a.id ? "border-accent" : "border-line text-muted hover:text-fg"}`}
              >
                {a.name}
                <span className="block text-xs text-muted">{new Date(a.createdAt).toLocaleDateString()}</span>
              </button>
              <button
                onClick={() => toggleCompare(a)}
                aria-pressed={compare.includes(a.id)}
                className={`border px-3 text-xs transition ${compare.includes(a.id) ? "border-accent bg-accent text-black" : "border-line text-muted hover:text-fg"}`}
              >
                Compare
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-8">
        {pair.length === 2 ? (
          <Panel className="space-y-6">
            <Label>{pair[0].name} vs {pair[1].name}</Label>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  outerRadius="75%"
                  data={TRAITS.map(([k, l]) => ({ subject: l, A: pair[0].analysis.big5[k], B: pair[1].analysis.big5[k] }))}
                >
                  <PolarGrid stroke="#2a2a30" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#8a8a90", fontSize: 11 }} />
                  <Radar name={pair[0].name} dataKey="A" stroke="#c8ff00" fill="#c8ff00" fillOpacity={0.2} />
                  <Radar name={pair[1].name} dataKey="B" stroke="#f2f2f0" fill="#f2f2f0" fillOpacity={0.1} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-line pt-4 text-sm leading-relaxed text-muted">
              {comparing ? <Loader2 className="h-4 w-4 animate-spin" /> : compareText}
            </div>
          </Panel>
        ) : current ? (
          <Report audit={current} onExport={exportReport} />
        ) : (
          <div className="flex h-[420px] items-center justify-center border border-dashed border-line text-sm text-muted">
            Run an assessment to see results here.
          </div>
        )}
      </div>
    </div>
  );
}

function Report({ audit, onExport }: { audit: Audit; onExport: () => void }) {
  const { analysis: a } = audit;
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <Label>Assessment report</Label>
          <h2 className="mt-1 text-2xl font-semibold">{audit.name}</h2>
          <p className="text-sm text-muted">
            {new Date(audit.createdAt).toLocaleString()} · confidence: <span className="text-fg">{a.confidence}</span>
          </p>
        </div>
        <GhostButton onClick={onExport} className="no-print">Export PDF</GhostButton>
      </div>

      {a.confidence === "low" && (
        <p className="border border-danger/40 p-3 text-sm text-danger">
          Low confidence: the input did not contain enough specific evidence. Treat these scores as tentative.
        </p>
      )}

      <Panel className="grid items-center gap-8 md:grid-cols-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="75%" data={TRAITS.map(([k, l]) => ({ subject: l, A: a.big5[k] }))}>
              <PolarGrid stroke="#2a2a30" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#8a8a90", fontSize: 11 }} />
              <Radar dataKey="A" stroke="#c8ff00" fill="#c8ff00" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          <Label>Summary</Label>
          <p className="leading-relaxed">{a.summary}</p>
          <p className="text-sm leading-relaxed text-muted">{a.riskWarning}</p>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel className="space-y-5">
          <Label>Workplace indicators</Label>
          <Meter label="Burnout risk (JD-R)" value={a.workplace.burnoutRisk} tone="danger" />
          <Meter label="Psychological safety" value={a.workplace.psychSafety} />
          <Meter label="Ownership mindset" value={a.workplace.ownership} />
        </Panel>
        <Panel className="space-y-5">
          <Label>Dark-triad indicators</Label>
          <Meter label="Narcissism" value={a.darkTriad.narcissism} tone="danger" />
          <Meter label="Machiavellianism" value={a.darkTriad.machiavellianism} tone="danger" />
          <Meter label="Psychopathy" value={a.darkTriad.psychopathy} tone="danger" />
        </Panel>
      </div>

      {a.evidence.length > 0 && (
        <Panel className="space-y-3">
          <Label>Evidence from the input</Label>
          <ul className="space-y-2 text-sm text-muted">
            {a.evidence.map((q, i) => <li key={i} className="border-l border-accent pl-3">“{q}”</li>)}
          </ul>
        </Panel>
      )}

      <Panel className="space-y-6">
        <Label>Assessment brief</Label>
        <p className="leading-relaxed text-muted">{a.brief}</p>
        <div className="space-y-3 border-t border-line pt-5">
          <Label>Recommended actions</Label>
          <ol className="space-y-2 text-sm">
            {a.actions.map((x, i) => (
              <li key={i} className="flex gap-3"><span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>{x}</li>
            ))}
          </ol>
        </div>
      </Panel>
    </div>
  );
}
