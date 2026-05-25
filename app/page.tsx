"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
  Brain, 
  BarChart3, 
  TrendingDown, 
  Users, 
  ShieldAlert, 
  LayoutDashboard, 
  UploadCloud, 
  Lock, 
  ChevronRight, 
  Scale, 
  AlertTriangle, 
  Fingerprint, 
  UserPlus, 
  Target, 
  History, 
  TrendingUp, 
  Printer, 
  Loader2 // <--- REGISTRATION COMPLETE
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import * as Papa from 'papaparse';
import { analyzePerformance, compareCandidates } from "./actions";

type Module = 'intelligence' | 'retention' | 'engagement' | 'risk';

export default function NeuralPlatform() {
  const [view, setView] = useState<'marketing' | 'dashboard'>('marketing');
  const [activeModule, setActiveModule] = useState<Module>('intelligence');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [text, setText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [compSummary, setCompSummary] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [currentAudit, setCurrentAudit] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('neural_history');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); } }
  }, []);

  if (!mounted) return null;

  // --- LOGIC (KEEPING YOUR SYSTEM INTACT) ---
  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("REQUIRED: IDENTITY + DATA");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      const nScore = Math.floor(((result.Conscientiousness * 0.4) + (result.Openness * 0.3)) - (result.Narcissism / 3));
      const newAudit = {
        id: Date.now(),
        name: candidateName.trim().toUpperCase(),
        score: nScore,
        date: new Date().toLocaleDateString(),
        data: [
          { subject: 'OPEN', A: result.Openness },
          { subject: 'CONS', A: result.Conscientiousness },
          { subject: 'EXTR', A: result.Extraversion },
          { subject: 'AGRE', A: result.Agreeableness },
          { subject: 'NEUR', A: result.Neuroticism },
        ],
        darkTriad: [
          { name: 'Narcissism', score: result.Narcissism },
          { name: 'Machiavellianism', score: result.Machiavellianism },
          { name: 'Psychopathy', score: result.Psychopathy },
        ],
        summary: result.summary,
        riskWarning: result.risk_warning,
      };
      const updatedHistory = [newAudit, ...history].slice(0, 10);
      setHistory(updatedHistory);
      setCurrentAudit(newAudit);
      localStorage.setItem('neural_history', JSON.stringify(updatedHistory));
      setText(""); setCandidateName("");
    } catch (error) { alert("ENGINE_BOTTLENECK"); }
    finally { setIsAnalyzing(false); }
  };

  // --- SUB-COMPONENTS (NEW DESIGN SYSTEM) ---

  const Nav = () => (
    <nav className="fixed top-0 inset-x-0 h-[60px] bg-ink/80 backdrop-blur-[12px] border-b border-edge z-[50] flex items-center justify-between px-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('marketing')}>
          <div className="w-[26px] h-[26px] border border-signal flex items-center justify-center">
            <div className="w-[8px] h-[8px] bg-signal animate-pulse-signal rotate-45" />
          </div>
          <span className="font-syne font-bold text-sm tracking-tighter uppercase">The Neural System</span>
        </div>
        <div className="hidden md:flex gap-8 ml-10">
          {['Platform', 'Intelligence', 'Enterprise', 'Research'].map(link => (
            <button key={link} className="text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:text-signal transition-colors">{link}</button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-signal animate-blink">
          <div className="w-1.5 h-1.5 rounded-full bg-signal shadow-[0_0_8px_#00e5a0]" />
          System Operational
        </div>
        <Button onClick={() => setView('dashboard')} variant="outline" className="border-signal text-signal text-[10px] uppercase font-bold tracking-widest hover:bg-signal-dim rounded-none h-9 px-6 transition-all">
          Request Access
        </Button>
      </div>
    </nav>
  );

  const Ticker = () => (
    <div className="w-full h-11 bg-ink border-y border-edge flex items-center overflow-hidden">
      <div className="h-full px-6 border-r border-edge bg-ink flex items-center text-signal font-bold text-[10px] tracking-[0.2em] whitespace-nowrap z-10 uppercase">Live Signals</div>
      <div className="flex animate-ticker whitespace-nowrap gap-12 items-center text-[10px] font-mono text-text-secondary uppercase">
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            <span>ENG COHESION 91.3 ▲+2.1</span>
            <span>FLIGHT RISK 7 flagged ▲-3</span>
            <span>TOXICITY IDX 0.12 ▲-0.04</span>
            <span>PERFORMANCE 87.4</span>
            <span>RETENTION PROB 94.2%</span>
            <span>BURNOUT SIGNAL MODERATE</span>
            <span>TEAM SYNC 78.9</span>
            <span>OCI SCORE 87.4</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // --- VIEW 1: DEFENSE-GRADE MARKETING ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen pt-[60px] overflow-x-hidden">
        <Nav />
        
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-10 px-10 py-24 min-h-[90vh]">
          <div className="flex flex-col justify-center space-y-8 max-w-xl">
            <div className="animate-fadeUp [animation-delay:100ms] inline-flex items-center gap-3 px-3 py-1 border border-signal/25 rounded-[2px] w-fit">
              <div className="w-1 h-1 rounded-full bg-signal" />
              <span className="text-signal text-[10px] uppercase tracking-[0.18em] font-bold">Institutional Grade Human Capital Intelligence</span>
            </div>
            
            <h1 className="animate-fadeUp [animation-delay:200ms] text-[clamp(44px,8vw,72px)] font-syne font-extrabold leading-[0.95] tracking-[-0.03em] uppercase">
              Precision<br/>Human<br/><span className="outline-text">Intelligence</span>
            </h1>

            <p className="animate-fadeUp [animation-delay:300ms] text-[13px] leading-[1.9] text-text-secondary max-w-[400px]">
              Quantify psychological certainty. Eliminate workplace toxicity. The Neural System delivers AI-driven performance analytics that transform how organizations understand their people.
            </p>

            <div className="animate-fadeUp [animation-delay:400ms] flex gap-4 pt-4">
              <Button onClick={() => setView('dashboard')} className="bg-signal text-black hover:opacity-85 font-black uppercase tracking-tighter text-[13px] px-8 h-12 rounded-[3px] transition-transform hover:-translate-y-1">
                Request Access →
              </Button>
              <Button variant="ghost" className="border border-edge-2 text-text-secondary hover:text-text-primary uppercase tracking-[0.1em] text-[10px] font-bold px-8 h-12 rounded-[3px]">
                View Demo
              </Button>
            </div>
          </div>

          <div className="animate-fadeUp [animation-delay:500ms] flex items-center justify-center">
            {/* MOCKUP TERMINAL */}
            <div className="w-full max-w-[550px] aspect-[4/3] bg-ink-2 border border-edge rounded-[6px] overflow-hidden shadow-2xl flex flex-col">
              <div className="h-8 bg-ink-3 border-b border-edge flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-40" />
                </div>
                <div className="text-[9px] font-mono text-text-muted">neural.system / analytics / overview</div>
                <div className="w-8" />
              </div>
              <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                <Card className="bg-ink-3 border-edge p-4 space-y-4">
                  <div className="text-[9px] text-text-muted uppercase">Org Certainty Index</div>
                  <div className="text-2xl font-syne text-text-primary">87.4 <span className="text-signal text-[10px]">↑ 3.2</span></div>
                  <div className="flex items-end gap-1 h-12">
                    {[40,55,45,70,60,80,65,75,90,85,92,88].map((h, i) => (
                      <div key={i} className={`flex-1 ${i === 11 ? 'bg-signal' : 'bg-edge-2'}`} style={{height: `${h}%`}} />
                    ))}
                  </div>
                </Card>
                <Card className="bg-ink-3 border-edge p-4 space-y-4">
                  <div className="text-[9px] text-text-muted uppercase">Toxicity Risk Score</div>
                  <div className="text-2xl font-syne text-text-primary">0.12 <span className="text-rose-500/50 text-[10px]">↓ 61%</span></div>
                  <div className="flex items-end gap-1 h-12">
                    {[90,80,75,70,62,55,48,40,32,25,18,12].map((h, i) => (
                      <div key={i} className="flex-1 bg-rose-500/20" style={{height: `${h}%`}} />
                    ))}
                  </div>
                </Card>
                <Card className="col-span-2 bg-ink-3 border-edge p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[12px] font-bold text-text-primary">342 employees calibrated</div>
                      <div className="text-[9px] text-text-muted uppercase">Real-time psychometric modeling</div>
                    </div>
                    <div className="text-[8px] text-signal uppercase tracking-widest font-bold animate-blink">● LIVE</div>
                  </div>
                  <div className="flex items-end gap-2 h-20 pt-4">
                    {[30,45,70,40,90,65,50,85,40,75,60,95,30,55,80].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-signal/5 to-signal/40" style={{height: `${h}%`}} />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Ticker />

        {/* STATS */}
        <section className="grid grid-cols-3 border-b border-edge bg-edge">
          {[
            { n: "94%", s: "%", l: "Prediction accuracy on retention risk modeling" },
            { n: "3.8", s: "×", l: "Reduction in toxic workplace incidents" },
            { n: "180", s: "+", l: "Enterprise clients across regulated industries" },
          ].map(stat => (
            <div key={stat.l} className="bg-ink p-16 space-y-4">
              <div className="text-4xl font-syne font-extrabold">{stat.n}<span className="text-signal">{stat.s}</span></div>
              <div className="text-[11px] uppercase tracking-widest text-text-secondary leading-relaxed max-w-[200px]">{stat.l}</div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-3 bg-edge">
          {[
            { id: "01", t: "Psychometric Calibration", b: "Multi-dimensional psychological profiling anchored in validated frameworks. Certainty scores, not subjective ratings.", i: "◈" },
            { id: "02", t: "Toxicity Detection", b: "Continuous behavioral signal analysis identifies interpersonal risks before they compound into organizational damage.", i: "⬡" },
            { id: "03", t: "Retention Intelligence", b: "Predictive models surface flight-risk individuals weeks ahead of departure signals visible to conventional HR tools.", i: "◉" },
            { id: "04", t: "Performance Vectors", b: "Trajectory modeling that separates high-potential from high-effort — enabling precise allocation of development capital.", i: "⬟" },
            { id: "05", t: "Team Coherence Score", b: "Network analysis of collaboration patterns reveals structural dysfunction before it manifests in output metrics.", i: "◇" },
            { id: "06", t: "Executive Reporting", b: "Board-grade intelligence briefs. Zero jargon. Actionable signals distilled into decisions your leadership team can act on today.", i: "△" },
          ].map(f => (
            <div key={f.id} className="bg-ink p-10 space-y-8 hover:bg-[#0c0e12] transition-colors relative group border-[0.5px] border-transparent hover:border-edge-2">
              <span className="absolute top-6 right-6 text-[10px] text-text-muted font-mono">{f.id}</span>
              <div className="w-10 h-10 border border-edge-2 rounded-[6px] flex items-center justify-center text-signal text-xl">{f.i}</div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text-primary tracking-tight">{f.t}</h3>
                <p className="text-[12px] text-text-secondary leading-relaxed font-light">{f.b}</p>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="px-10 py-12 flex justify-between items-center text-[10px] text-text-muted border-t border-edge uppercase tracking-[0.15em]">
          <div>© 2025 The Neural System · All intelligence reserved.</div>
          <div className="flex gap-8">
            {['Privacy', 'Security', 'Terms', 'Research'].map(l => (
              <span key={l} className="hover:text-text-secondary cursor-pointer">{l}</span>
            ))}
          </div>
        </footer>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD (Restyled to match spec) ---
  return (
    <div className="min-h-screen bg-ink flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 border-r border-edge bg-ink-2 flex flex-col p-6 space-y-10 print:hidden relative z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('marketing')}>
          <div className="w-6 h-6 border border-signal flex items-center justify-center">
            <div className="w-2 h-2 bg-signal rotate-45" />
          </div>
          <span className="font-syne font-bold text-[10px] uppercase tracking-widest text-text-primary">Neural System</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'intelligence', l: 'Intelligence', i: <LayoutDashboard size={14}/> },
            { id: 'retention', l: 'Retention', i: <TrendingDown size={14}/> },
            { id: 'engagement', l: 'Engagement', i: <Users size={14}/> },
            { id: 'risk', l: 'Risk Audit', i: <ShieldAlert size={14}/> },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveModule(item.id as Module)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[3px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeModule === item.id ? 'bg-signal text-black' : 'text-text-secondary hover:text-text-primary hover:bg-ink-3'}`}
            >
              {item.i} {item.l}
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 overflow-y-auto relative">
        <div className="p-10 max-w-6xl mx-auto space-y-12">
          
          {activeModule === 'intelligence' && (
            <div className="space-y-12 animate-fadeUp">
              <header className="flex justify-between items-end border-b border-edge pb-6">
                <div>
                  <h2 className="text-2xl font-syne font-extrabold tracking-tighter">Terminal / Core.Intelligence</h2>
                  <div className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">Behavioral Signature Mapping</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[9px] font-bold text-rose-500/80 uppercase border border-rose-500/20 px-3 py-1 bg-rose-500/5">Classified: Tier 1 Data</div>
                  <Button variant="outline" className="border-edge-2 text-text-secondary text-[10px] uppercase font-bold h-8 rounded-[2px] px-6">System.Export</Button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2"><UserPlus size={12}/> Identity</label>
                      <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-ink-2 border border-edge p-3 text-[11px] text-text-primary focus:border-signal outline-none font-mono" placeholder="NAME_STRING" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Data.Raw</label>
                      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 bg-ink-2 border border-edge p-4 text-[11px] text-text-primary focus:border-signal outline-none font-mono resize-none" placeholder="INSERT_DATA_FIELD" />
                    </div>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-signal text-black font-black text-[11px] uppercase h-12 rounded-[2px]">
                      {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : "Process Signal"}
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-8">
                   {currentAudit ? (
                     <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-8 items-center bg-ink-2 border border-edge p-8 rounded-[4px]">
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                                <Radar name="Subject" dataKey="A" stroke="#00e5a0" fill="#00e5a0" fillOpacity={0.2} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-6">
                             <div className="text-[11px] text-signal font-bold uppercase tracking-widest border-b border-signal/20 pb-2">{currentAudit.name} Signature</div>
                             <p className="text-[12px] leading-[1.8] text-text-secondary italic font-light font-mono">"{currentAudit.summary}"</p>
                          </div>
                        </div>
                        <div className="bg-rose-500/[0.02] border border-rose-500/10 p-8 rounded-[4px] space-y-8">
                          <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2"><AlertTriangle size={14}/> Risk.Diagnostic</h3>
                          <div className="grid grid-cols-3 gap-8">
                            {currentAudit.darkTriad?.map((t: any) => (
                              <div key={t.name} className="space-y-3">
                                <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase"><span>{t.name}</span><span className="text-text-primary">{t.score}%</span></div>
                                <div className="h-[1px] w-full bg-edge overflow-hidden"><div className="h-full bg-rose-500/60" style={{ width: `${t.score}%` }} /></div>
                              </div>
                            ))}
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="h-[500px] border border-dashed border-edge flex flex-col items-center justify-center text-center p-12 opacity-30">
                        <Fingerprint size={32} className="mb-6" />
                        <div className="text-[10px] uppercase tracking-[0.4em]">Terminal Standby</div>
                     </div>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* ... Other Modules follow similar restyling ... */}
          {activeModule !== 'intelligence' && (
            <div className="h-[60vh] flex flex-col items-center justify-center opacity-20">
              <Scale size={48} className="mb-6" />
              <div className="text-[11px] uppercase tracking-[0.5em]">Module Under Calibration</div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}