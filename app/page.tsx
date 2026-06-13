"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, History, Target, BarChart3, Printer, ChevronRight, Zap, Shield, 
  Globe, AlertTriangle, Fingerprint, Users, TrendingUp, UserPlus, Lock, 
  LayoutDashboard, TrendingDown, UploadCloud, ShieldAlert, Loader2, Scale,
  Flame, HeartHandshake, ShieldCheck, FileText
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Legend, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';
import * as Papa from 'papaparse';
import { analyzePerformance, compareCandidates } from "./actions";

// --- SYSTEM HELPERS ---

const StatsCard = ({ label, value, trend, color }: any) => (
  <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl border-l-2" style={{ borderLeftColor: color }}>
    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex justify-between items-end">
      <h4 className="text-3xl font-black italic text-white">{value}</h4>
      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{trend}</span>
    </div>
  </Card>
);

const ScientificBar = ({ label, value, icon, color }: any) => (
  <div className="space-y-3 text-left p-4 bg-zinc-900/30 rounded-xl border border-zinc-900">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
      <span className="flex items-center gap-2">{icon} {label}</span>
      <span className="text-white font-mono">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-1000`} style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);

type Module = 'intelligence' | 'retention' | 'engagement' | 'risk';

export default function NeuralPlatform() {
  const [view, setView] = useState<'marketing' | 'dashboard'>('marketing');
  const [activeModule, setActiveModule] = useState<Module>('intelligence');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [text, setText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [compSummary, setCompSummary] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [currentAudit, setCurrentAudit] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [retentionStats, setRetentionStats] = useState({ rate: "14.2", loss: "08" });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('neural_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("IDENTITY_REQUIRED");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      const nScore = Math.floor(((result.Conscientiousness * 0.4) + (result.Openness * 0.3) + (result.PsychSafety * 0.3)) - (result.Narcissism / 3));

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
        scientific: [
          { name: 'Burnout Risk (JD-R)', score: result.BurnoutRisk, icon: <Flame size={12}/>, color: '#f43f5e' },
          { name: 'Psychological Safety', score: result.PsychSafety, icon: <ShieldCheck size={12}/>, color: '#00e5a0' },
          { name: 'Ownership Mindset', score: result.Ownership, icon: <HeartHandshake size={12}/>, color: '#8b5cf6' },
        ],
        summary: result.summary,
        prognosis: result.in_depth_prognosis, // Capturing the new clinical text
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

  const toggleCompare = async (audit: any) => {
    if (compareList.find(a => a.id === audit.id)) {
      setCompareList(compareList.filter(a => a.id !== audit.id));
      setCompSummary("");
    } else if (compareList.length < 2) {
      const newList = [...compareList, audit];
      setCompareList(newList);
      if (newList.length === 2) {
        setIsComparing(true);
        const summary = await compareCandidates(newList[0], newList[1]);
        setCompSummary(summary);
        setIsComparing(false);
      }
    }
  };

  // --- MARKETING VIEW ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-12 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,160,0.08)_0%,_transparent_70%)]" />
        <div className="flex items-center gap-3 mb-4 animate-pulse relative z-10">
          <div className="w-10 h-10 border border-[#00e5a0] flex items-center justify-center rotate-45"><div className="w-4 h-4 bg-[#00e5a0]" /></div>
          <span className="font-black italic text-3xl uppercase tracking-tighter">The Neural System</span>
        </div>
        <div className="max-w-5xl space-y-10 relative z-10">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic leading-[0.85] uppercase">
            Quantify <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5a0] to-emerald-500 font-black">Certainty.</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed italic">
            "Institutional Human Capital Intelligence powered by Behavioral Science."
          </p>
          <Button onClick={() => setView('dashboard')} className="h-20 px-16 bg-[#00e5a0] text-black font-black uppercase text-2xl rounded-none active:scale-95 transition-all shadow-[0_0_50px_rgba(0,229,160,0.3)] hover:bg-white">
            Access Terminal
          </Button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-72 border-r border-zinc-900 flex flex-col p-8 space-y-10 print:hidden bg-zinc-950/50 backdrop-blur-xl">
        <button onClick={() => setView('marketing')} className="flex items-center gap-3 group">
          <div className="w-6 h-6 border border-[#00e5a0] flex items-center justify-center rotate-45"><div className="w-2 h-2 bg-[#00e5a0]" /></div>
          <span className="font-black italic text-md uppercase tracking-tighter text-left leading-none group-hover:text-[#00e5a0]">Neural<br/>System</span>
        </button>
        <nav className="flex-1 space-y-3 text-left">
          <button onClick={() => setActiveModule('intelligence')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeModule === 'intelligence' ? 'bg-[#00e5a0] text-black shadow-[0_0_25px_rgba(0,229,160,0.3)]' : 'text-zinc-500 hover:text-white'}`}><LayoutDashboard size={14}/> Intelligence</button>
          <button onClick={() => setActiveModule('retention')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeModule === 'retention' ? 'bg-[#00e5a0] text-black shadow-[0_0_25px_rgba(0,229,160,0.3)]' : 'text-zinc-500 hover:text-white'}`}><TrendingDown size={14}/> Retention</button>
          <button onClick={() => setActiveModule('engagement')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeModule === 'engagement' ? 'bg-[#00e5a0] text-black shadow-[0_0_25px_rgba(0,229,160,0.3)]' : 'text-zinc-500 hover:text-white'}`}><Users size={14}/> Engagement</button>
          <button onClick={() => setActiveModule('risk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeModule === 'risk' ? 'bg-[#00e5a0] text-black shadow-[0_0_25px_rgba(0,229,160,0.3)]' : 'text-zinc-500 hover:text-white'}`}><ShieldAlert size={14}/> Manager Risk</button>
        </nav>
        <div className="pt-8 border-t border-zinc-900 text-left">
             <p className="text-[10px] font-black uppercase text-[#00e5a0] tracking-widest">L. Pienaar</p>
             <p className="text-[8px] font-bold uppercase text-zinc-600 mt-1">Lead Performance Architect</p>
        </div>
      </div>

      <main className="flex-1 p-12 overflow-y-auto">
        {activeModule === 'intelligence' && (
          <div className="space-y-16 text-left animate-in fade-in duration-700">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-10">
              <div><h2 className="text-4xl font-black italic uppercase tracking-tighter">Intelligence Terminal</h2><p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.5em] mt-2 italic">v3.1 // Executive Prognosis Active</p></div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase border border-rose-500/20 px-4 py-2 rounded-lg bg-rose-500/5"><Lock size={12}/> Classified: Tier 1</div>
                 <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] font-bold h-10 px-6">System.Export</Button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* INPUT COLUMN */}
              <div className="lg:col-span-4 space-y-10">
                <div className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><UserPlus size={14}/> Candidate Identity</label>
                    <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none focus:border-[#00e5a0] transition-all font-mono" placeholder="SENDER_ID" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><Target size={14}/> Behavioral Data</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-400 outline-none focus:border-[#00e5a0] transition-all font-mono resize-none" placeholder="INSERT_DATA_RAW" />
                  </div>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase h-14 shadow-2xl hover:bg-[#00e5a0] transition-all">{isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : "Initiate Neural Audit"}</Button>
                </div>
                
                {/* REGISTRY */}
                <div className="pt-8 border-t border-zinc-900 text-left">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><History size={14}/> Registry</h3>
                    <div className="space-y-3">
                        {history?.map((item) => (
                            <div key={item.id} className="flex gap-2">
                                <button onClick={() => {setCurrentAudit(item); setCompareList([]);}} className={`flex-1 text-left p-4 rounded-2xl border text-[10px] font-bold uppercase transition-all ${currentAudit?.id === item.id ? 'border-[#00e5a0] bg-[#00e5a0]/5 text-white shadow-xl' : 'border-zinc-900 text-zinc-600'}`}>{item.name}</button>
                                <button onClick={() => toggleCompare(item)} className={`p-4 rounded-2xl border transition-all ${compareList.find(a => a.id === item.id) ? 'bg-[#00e5a0] text-black border-[#00e5a0]' : 'border-zinc-900 text-zinc-700 hover:text-white'}`}><Users size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              {/* DATA VISUALS COLUMN */}
              <div className="lg:col-span-8 space-y-12">
                {compareList.length === 2 ? (
                  <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="bg-zinc-950/40 p-10 rounded-[2rem] border border-zinc-900 h-[450px] shadow-2xl"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0]?.data?.map((d: any, i: number) => ({ subject: d.subject, A: d.A, B: compareList[1]?.data[i]?.A || 0 }))}><PolarGrid stroke="rgba(255,255,255,0.05)" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} /><Radar name={compareList[0].name} dataKey="A" stroke="#00e5a0" fill="#00e5a0" fillOpacity={0.3} /><Radar name={compareList[1].name} dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} /><Legend /></RadarChart></ResponsiveContainer></div>
                    <Card className="bg-[#00e5a0]/5 border border-[#00e5a0]/10 p-8 rounded-2xl text-left"><h3 className="text-[#00e5a0] text-[10px] font-black uppercase mb-4 flex items-center gap-2"><Brain size={14}/> Comparative Differential</h3>{isComparing ? <div className="flex items-center gap-3 text-zinc-600 text-xs italic"><Loader2 className="animate-spin w-4 h-4" /> Synthesizing data points...</div> : <p className="text-sm text-zinc-300 italic leading-loose font-light">"{compSummary}"</p>}</Card>
                  </div>
                ) : currentAudit ? (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    {/* RADAR & SUMMARY */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-950/20 p-10 rounded-[2rem] border border-zinc-900 shadow-2xl">
                      <div className="h-[350px] w-full"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}><PolarGrid stroke="#27272a" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} /><Radar name="Candidate" dataKey="A" stroke="#00e5a0" fill="#00e5a0" fillOpacity={0.4} /></RadarChart></ResponsiveContainer></div>
                      <div className="space-y-6 text-left"><h3 className="text-[11px] font-black uppercase text-[#00e5a0] italic tracking-widest">{currentAudit.name} Signature</h3><p className="text-sm text-zinc-300 italic leading-relaxed font-light">"{currentAudit.summary}"</p></div>
                    </div>

                    {/* SCIENTIFIC METRICS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {currentAudit.scientific?.map((s: any) => (
                        <ScientificBar key={s.name} label={s.name} value={s.score} icon={s.icon} color={s.color} />
                      ))}
                    </div>

                    {/* TOXICITY AUDIT */}
                    <div className="bg-rose-950/5 p-10 rounded-[2.5rem] border border-rose-900/10 space-y-8 text-left">
                        <h3 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-3 tracking-[0.4em]"><AlertTriangle size={14}/> Risk Diagnostic</h3>
                        <div className="grid grid-cols-3 gap-8">
                            {currentAudit.darkTriad?.map((t: any) => (
                                <div key={t.name} className="space-y-3">
                                    <div className="flex justify-between text-[10px] uppercase font-black text-zinc-600"><span>{t.name}</span><span className="text-white font-mono">{t.score}%</span></div>
                                    <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]" style={{ width: `${t.score}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- NEW: CLINICAL PROGNOSIS SECTION --- */}
                    <Card className="bg-violet-950/5 border border-violet-500/10 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="bg-violet-500/10 px-10 py-6 border-b border-violet-500/10 flex justify-between items-center">
                            <h3 className="text-violet-400 text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                            <Brain className="w-5 h-5" /> Executive Clinical Intelligence Brief
                            </h3>
                            <span className="text-[9px] font-mono text-violet-500/50 uppercase italic">Confidential Analysis // v3.1</span>
                        </div>
                        <CardContent className="p-12 space-y-10 text-left">
                            <div className="space-y-8">
                                <p className="text-lg text-zinc-300 leading-relaxed font-light italic opacity-90 first-letter:text-5xl first-letter:font-black first-letter:text-violet-500 first-letter:mr-3 first-letter:float-left">
                                {currentAudit.prognosis || "Prognosis documentation unavailable for this session identity."}
                                </p>
                            </div>

                            <div className="mt-12 pt-10 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-[#00e5a0] uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Strategic Prescriptions
                                    </h4>
                                    <ul className="text-xs text-zinc-500 space-y-4 list-none">
                                        <li className="flex gap-4"><span className="text-[#00e5a0] font-mono font-bold">01</span> CALIBRATE JD-R: Align workload demands with available autonomy resources.</li>
                                        <li className="flex gap-4"><span className="text-[#00e5a0] font-mono font-bold">02</span> VOICE INITIATIVE: Increase Psych Safety to surface hidden operational friction.</li>
                                        <li className="flex gap-4"><span className="text-[#00e5a0] font-mono font-bold">03</span> RISK MITIGATION: Monitor Dark Triad markers for signs of cultural derailment.</li>
                                    </ul>
                                </div>
                                <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800">
                                    <p className="text-[9px] text-zinc-600 leading-relaxed uppercase font-black mb-3 tracking-tighter">Architect's Summary:</p>
                                    <p className="text-[11px] text-zinc-400 italic font-light leading-relaxed">
                                    "This signature indicates a high-performance profile with specific environmental dependencies. Failure to provide adequate psychological safety will likely result in critical skill loss within 12 months."
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                  </div>
                ) : (
                  <div className="h-[600px] border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-30"><Fingerprint className="w-16 h-16 text-zinc-800 mb-6" /><h3 className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.5em]">Terminal Active // Standby</h3></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OTHER MODULES (Unchanged) */}
        {activeModule === 'retention' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12 text-left">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8 text-left">
              <div><h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#00e5a0]">Retention Shield</h2><p className="text-zinc-600 text-[10px] uppercase font-bold mt-1 tracking-widest italic">Attrition Monitor</p></div>
              <Button className="bg-white text-black text-[10px] font-black uppercase h-12 px-8"><UploadCloud size={14} className="mr-2" /> Ingest CSV</Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard label="Turnover Rate" value="14.2%" trend="Live" color="#00e5a0" />
              <StatsCard label="Critical Loss" value="08" trend="Alert" color="#f43f5e" />
              <StatsCard label="Retention ROI" value="R1.2M" trend="Est." color="#8b5cf6" />
            </div>
          </div>
        )}

        {(activeModule === 'engagement' || activeModule === 'risk') && (
           <div className="h-[60vh] flex flex-col items-center justify-center opacity-30 text-center">
             <Scale size={48} className="mb-6" />
             <h3 className="text-zinc-500 font-bold uppercase tracking-[0.6em]">Module Active // Data Sync Pending</h3>
           </div>
        )}
      </main>
    </div>
  );
}