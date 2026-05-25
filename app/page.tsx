"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, History, Target, BarChart3, 
  Printer, ChevronRight, Zap, Shield, Globe, 
  AlertTriangle, Fingerprint, Users, TrendingUp, 
  UserPlus, Lock, LayoutDashboard, TrendingDown, 
  UploadCloud, ShieldAlert, Loader2, Scale
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';
import * as Papa from 'papaparse';
import { analyzePerformance, compareCandidates } from "./actions";

const StatsCard = ({ label, value, trend, color }: any) => (
  <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl">
    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex justify-between items-end">
      <h4 className={`text-3xl font-black italic ${color}`}>{value}</h4>
      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{trend}</span>
    </div>
  </Card>
);

const PulseBar = ({ label, value, color }: any) => (
  <div className="space-y-2 text-left">
    <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500">
      <span>{label}</span>
      <span className="text-white font-mono">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

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
  const [retentionStats, setRetentionStats] = useState({ rate: "14.2%", loss: "08" });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('neural_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("Enter Name and Data.");
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
    } catch (error) { alert("Engine Bottleneck."); }
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

  const NavItem = ({ icon, label, id }: { icon: any, label: string, id: Module }) => (
    <button 
      onClick={() => setActiveModule(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeModule === id ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}`}
    >
      {React.cloneElement(icon, { size: 14 })}
      {label}
    </button>
  );

  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="flex items-center gap-3 mb-4 animate-neural">
          <Brain className="w-10 h-10 text-violet-500" />
          <span className="font-black italic text-2xl uppercase tracking-tighter">The Neural System</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-tight">
          Precision <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Human Intelligence.</span>
        </h1>
        <Button onClick={() => setView('dashboard')} className="h-16 px-12 bg-white text-black font-black uppercase text-xl rounded-none active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          Access Terminal
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <div className="w-64 border-r border-zinc-900 flex flex-col p-6 space-y-8 print:hidden">
        <button onClick={() => setView('marketing')} className="flex items-center gap-3 group">
          <Brain className="w-6 h-6 text-violet-500 animate-neural" />
          <span className="font-black italic text-sm uppercase tracking-tighter text-left leading-none group-hover:text-violet-400">Neural<br/>System</span>
        </button>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Intelligence" id="intelligence" />
          <NavItem icon={<TrendingDown />} label="Retention" id="retention" />
          <NavItem icon={<Users />} label="Engagement" id="engagement" />
          <NavItem icon={<ShieldAlert />} label="Manager Risk" id="risk" />
        </nav>
        <div className="pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-3 p-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-left">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white">HR</div>
            Admin Mode
          </div>
        </div>
      </div>

      <main className="flex-1 p-12 overflow-y-auto">
        {activeModule === 'intelligence' && (
          <div className="space-y-12 text-left animate-in fade-in duration-700">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Intelligence Terminal</h2>
                <p className="text-zinc-600 text-[10px] uppercase font-bold mt-1 tracking-widest">v2.5 // Behavioral Audit</p>
              </div>
              <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] font-bold h-8">Export Report</Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4 space-y-8">
                <div className="space-y-6 text-left">
                  <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><UserPlus size={14}/> Candidate Name</label>
                  <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white outline-none" placeholder="Enter Name..." /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><Target size={14}/> Data</label>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 outline-none" placeholder="Paste data..." /></div>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase h-12">{isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Initiate Audit"}</Button>
                </div>
                <div className="pt-8 border-t border-zinc-900 text-left">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-4">Registry</h3>
                  <div className="space-y-2">
                    {history?.map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <button onClick={() => {setCurrentAudit(item); setCompareList([]);}} className={`flex-1 text-left p-3 rounded-xl border text-[10px] font-bold uppercase ${currentAudit?.id === item.id ? 'border-violet-500 bg-violet-500/5 text-white' : 'border-zinc-900 text-zinc-600'}`}>{item.name}</button>
                        <button onClick={() => toggleCompare(item)} className={`p-3 rounded-xl border ${compareList.find(a => a.id === item.id) ? 'bg-violet-600 text-white' : 'border-zinc-900 text-zinc-700'}`}><Users size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                {compareList.length === 2 ? (
                  <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="bg-zinc-950/40 p-10 rounded-[2.5rem] border border-violet-900/20 h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0]?.data?.map((d: any, i: number) => ({ subject: d.subject, A: d.A, B: compareList[1]?.data[i]?.A || 0 }))}>
                          <PolarGrid stroke="#27272a" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                          <Radar name={compareList[0].name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Radar name={compareList[1].name} dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <Card className="bg-violet-950/5 border-violet-500/10 p-8 rounded-2xl text-left"><h3 className="text-violet-500 text-[10px] font-black uppercase mb-4 flex items-center gap-2"><Brain size={14}/> Comparative Intelligence</h3>{isComparing ? <div className="flex items-center gap-3 text-zinc-600 text-xs italic"><Loader2 className="animate-spin w-4 h-4" /> Processing...</div> : <p className="text-sm text-zinc-300 italic font-light leading-relaxed">"{compSummary}"</p>}</Card>
                  </div>
                ) : currentAudit ? (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-950/20 p-10 rounded-[2rem] border border-zinc-900">
                      <div className="h-[350px] w-full"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}><PolarGrid stroke="#27272a" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} /><Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} /></RadarChart></ResponsiveContainer></div>
                      <div className="space-y-6 text-left"><h3 className="text-[11px] font-black uppercase text-violet-500 italic tracking-widest">{currentAudit.name} Signature</h3><p className="text-sm text-zinc-400 italic leading-relaxed">"{currentAudit.summary}"</p></div>
                    </div>
                    <div className="bg-rose-950/5 p-10 rounded-[2.5rem] border border-rose-900/10 space-y-8 text-left"><h3 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-3 tracking-[0.4em]"><AlertTriangle size={14}/> Toxicity Audit</h3><div className="grid grid-cols-3 gap-8">{currentAudit.darkTriad?.map((t: any) => (<div key={t.name} className="space-y-3"><div className="flex justify-between text-[10px] uppercase font-black text-zinc-600"><span>{t.name}</span><span className="text-white font-mono">{t.score}%</span></div><div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-rose-600" style={{ width: `${t.score}%` }} /></div></div>))}</div></div>
                  </div>
                ) : (
                  <div className="h-[600px] border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12"><Fingerprint className="w-16 h-16 text-zinc-800 mb-6" /><h3 className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.5em]">Terminal Active // Standby</h3></div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeModule === 'retention' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12 text-left">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8 text-left">
              <div><h2 className="text-3xl font-black italic uppercase tracking-tighter">Retention Shield</h2><p className="text-zinc-600 text-[10px] uppercase font-bold mt-1 tracking-widest">Attrition Monitor</p></div>
              <div className="relative group">
                <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => {
                  const file = e.target.files?.[0]; if (file) Papa.parse(file, { header: true, complete: (res) => {
                    const leavers = res.data.filter((row: any) => row.Exit_Date).length;
                    const total = res.data.length;
                    const rate = ((leavers / total) * 100).toFixed(1);
                    setRetentionStats({ rate: `${rate}%`, loss: leavers.toString().padStart(2, '0') });
                    alert(`Ingested ${total} records.`);
                  }});
                }} />
                <Button className="bg-white text-black text-[10px] font-black uppercase h-12 px-8"><UploadCloud size={14} className="mr-2" /> Ingest CSV</Button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard label="Turnover Rate" value={retentionStats.rate} trend="Live" color="text-emerald-400" />
              <StatsCard label="Critical Loss" value={retentionStats.loss} trend="Live" color="text-rose-500" />
              <StatsCard label="Retention ROI" value="R1.2M" trend="Est." color="text-violet-400" />
            </div>
          </div>
        )}

        {activeModule === 'engagement' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12 text-left">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
              <div><h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Engagement Pulse</h2><p className="text-zinc-600 text-[10px] uppercase font-bold mt-1 tracking-widest">Real-time Sentiment</p></div>
              <Button className="bg-violet-600 text-white text-[10px] font-black uppercase h-10 px-8">New Pulse</Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="bg-zinc-950 border-zinc-900 p-10 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 tracking-widest">Climate Profile</h3>
                <div className="space-y-8">
                   <PulseBar label="Workload Balance" value={42} color="bg-rose-500" />
                   <PulseBar label="Autonomy Level" value={78} color="bg-emerald-500" />
                   <PulseBar label="Team Support" value={55} color="bg-violet-500" />
                   <PulseBar label="Role Meaning" value={91} color="bg-indigo-500" />
                </div>
              </Card>
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Manager Nudges</h3>
                <Card className="bg-zinc-900/40 border-l-4 border-amber-500 p-8 rounded-r-2xl"><p className="text-sm text-zinc-300 italic font-light">"Workload balance is critical. Nudge: Remove one non-essential task from the team sprint by Monday."</p></Card>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'risk' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-12 text-left">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
              <div><h2 className="text-3xl font-black italic uppercase tracking-tighter text-rose-500">IR Risk Shield</h2><p className="text-zinc-600 text-[10px] uppercase font-bold mt-1 tracking-widest">Industrial Relations Analytics</p></div>
              <div className="flex items-center gap-2 text-[8px] font-black text-rose-500 uppercase border border-rose-500/20 px-3 py-1 rounded bg-rose-500/5"><Scale size={12} /> CCMA Protection Active</div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard label="Active Grievances" value="12" trend="+2" color="text-rose-500" />
              <StatsCard label="Disciplinary Cases" value="04" trend="-1" color="text-amber-500" />
              <StatsCard label="Avg. IR Risk Score" value="64/100" trend="High" color="text-rose-400" />
              <StatsCard label="Settlement Risk" value="R450k" trend="Est." color="text-rose-600" />
            </div>
            <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-zinc-900/50 text-zinc-500 uppercase font-black"><tr><th className="p-6">Manager</th><th className="p-6">Dept</th><th className="p-6 text-center">Risk Score</th><th className="p-6">Indicator</th><th className="p-6 text-right">Action</th></tr></thead>
                <tbody className="text-white">
                  <tr className="border-b border-zinc-900/50">
                    <td className="p-6 font-black uppercase">Johan van der Merwe</td>
                    <td className="p-6 text-zinc-500 uppercase">Operations</td>
                    <td className="p-6 text-center"><span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full font-bold">88/100</span></td>
                    <td className="p-6 text-zinc-500">High Grievance Frequency</td>
                    <td className="p-6 text-right"><Button variant="outline" className="border-rose-500/20 text-rose-500 h-8 text-[9px] uppercase font-bold">Deploy Coaching</Button></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}