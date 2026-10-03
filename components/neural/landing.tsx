import { PrimaryButton } from "./ui";

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex min-h-screen flex-col px-6 py-8 md:px-16">
      <header className="flex items-center gap-3">
        <span className="h-3 w-3 bg-accent" aria-hidden />
        <span className="text-sm font-medium tracking-wide">The Neural System</span>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-10 py-16">
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Human capital analytics, <span className="text-accent">grounded in evidence.</span>
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          Behavioural assessments, retention monitoring and manager risk, built on named
          industrial psychology frameworks, with every analysis logged and exportable.
        </p>
        <div>
          <PrimaryButton onClick={onEnter}>Open workspace</PrimaryButton>
        </div>
      </div>

      <dl className="grid gap-8 border-t border-line pt-8 text-sm md:grid-cols-3">
        {[
          ["Assessments", "Big Five and dark-triad indicators with confidence ratings and quoted evidence."],
          ["Retention", "Upload an HR export and see turnover by department, calculated from your data."],
          ["Audit trail", "Every analysis, comparison and export is recorded with a timestamp."],
        ].map(([t, d]) => (
          <div key={t} className="space-y-2">
            <dt className="font-medium">{t}</dt>
            <dd className="text-muted">{d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
