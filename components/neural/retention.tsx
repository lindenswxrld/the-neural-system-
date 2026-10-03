"use client";

import { useState } from "react";
import * as Papa from "papaparse";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GhostButton, Label, Panel } from "./ui";

type Row = { department: string; exited: boolean };

const EXITED = /exit|left|resign|terminat|dismiss|inactive/i;
const TEMPLATE = "department,status\nSales,active\nSales,exited\nEngineering,active\nEngineering,active\n";

export function Retention({ onEvent }: { onEvent: (action: string, subject?: string) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [file, setFile] = useState("");
  const [error, setError] = useState("");

  function ingest(f: File) {
    setError("");
    Papa.parse<Record<string, string>>(f, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase(),
      complete: (res) => {
        const parsed = res.data
          .filter((r) => r.status !== undefined)
          .map((r) => ({ department: (r.department || "Unassigned").trim(), exited: EXITED.test(r.status ?? "") }));
        if (parsed.length === 0) return setError("No rows found. The file needs a 'status' column (and optionally 'department').");
        setRows(parsed);
        setFile(f.name);
        onEvent("Retention data ingested", `${f.name} (${parsed.length} rows)`);
      },
      error: () => setError("The file could not be read as CSV."),
    });
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([TEMPLATE], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "retention-template.csv" });
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = rows && (() => {
    const exits = rows.filter((r) => r.exited).length;
    const by = new Map<string, { n: number; x: number }>();
    rows.forEach((r) => {
      const d = by.get(r.department) ?? { n: 0, x: 0 };
      d.n++; if (r.exited) d.x++;
      by.set(r.department, d);
    });
    return {
      total: rows.length,
      exits,
      rate: (exits / rows.length) * 100,
      depts: [...by].map(([department, d]) => ({ department, rate: Math.round((d.x / d.n) * 1000) / 10, headcount: d.n }))
        .sort((a, b) => b.rate - a.rate),
    };
  })();

  return (
    <div className="space-y-8">
      <div className="no-print flex flex-wrap items-center gap-3">
        <label className="cursor-pointer bg-accent px-6 py-3 text-sm font-medium text-black hover:opacity-90">
          Upload CSV
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => e.target.files?.[0] && ingest(e.target.files[0])} />
        </label>
        <GhostButton onClick={downloadTemplate}>Download template</GhostButton>
        {file && <span className="text-sm text-muted">{file}</span>}
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}

      {!stats ? (
        <div className="flex h-[300px] items-center justify-center border border-dashed border-line px-6 text-center text-sm text-muted">
          Upload an HR export with a status column (active / exited) to calculate turnover. Nothing leaves your browser.
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {[["Records", String(stats.total)], ["Exits", String(stats.exits)], ["Turnover", `${stats.rate.toFixed(1)}%`]].map(([l, v]) => (
              <Panel key={l}><Label>{l}</Label><p className="mt-2 text-4xl font-semibold">{v}</p></Panel>
            ))}
          </div>
          <Panel className="space-y-4">
            <Label>Turnover by department (%)</Label>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.depts}>
                  <XAxis dataKey="department" tick={{ fill: "#8a8a90", fontSize: 11 }} stroke="#2a2a30" />
                  <YAxis tick={{ fill: "#8a8a90", fontSize: 11 }} stroke="#2a2a30" />
                  <Tooltip contentStyle={{ background: "#101013", border: "1px solid #2a2a30" }} cursor={{ fill: "#ffffff08" }} />
                  <Bar dataKey="rate" fill="#c8ff00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
