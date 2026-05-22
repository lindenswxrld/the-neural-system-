"use client";

import React, { useState, useEffect } from 'react';
// 1. SHADCN UI COMPONENTS
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 2. LUCIDE ICONS
import { 
  Brain, History, Target, BarChart3, 
  Printer, ChevronRight, Zap, Shield, Globe, 
  AlertTriangle, Fingerprint, Users, TrendingUp, 
  UserPlus, Lock, LayoutDashboard, TrendingDown, 
  UploadCloud, ShieldAlert, Loader2 
} from "lucide-react";

// 3. VISUALIZATION & LIBRARIES
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';
import Papa from 'papaparse';

// 4. SERVER ACTIONS
import { analyzePerformance, compareCandidates } from "./actions";

// --- HELPER COMPONENT (Defined ONCE here) ---
const StatsCard = ({ label, value, trend, color }: { label: string, value: string, trend: string, color: string }) => (
  <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl">
    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex justify-between items-end">
      <h4 className={`text-3xl font-black italic ${color}`}>{value}</h4>
      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{trend}</span>
    </div>
  </Card>
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

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('neural_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { console.error("History parse error", e); }
    }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("Incomplete Data.");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      const nScore = Math.floor(
        ((result.Conscientiousness * 0.4) + (result.Openness * 0.3) + (result.Agreeableness * 0.1) + (result.Extraversion * 0.2)) - 
        (((result.Narcissism || 0) + (result.Machiavellianism || 0) + (result.Psychopathy || 0)) / 3)
      );

      const newAudit = {
        id: Date.now(),
        name: candidateName.trim().toUpperCase(),
        score: nScore,
        date: new Date().toLocaleDateString(),
        data: [
          { subject: 'Openness', A: result.Openness },
          { subject: 'Conscientiousness', A: result.Conscientiousness },
          { subject: 'Extraversion', A: result.Extraversion },
          { subject: 'Agreeableness', A: result.Agreeableness },
          { subject: 'Neuroticism', A: result.Neuroticism },
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
      setText("");
      setCandidateName("");
    } catch (error) { alert("Engine Latency."); }
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeModule === id ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}`}
    >
      {React.cloneElement(icon, { size: 16 })}
      {label}
    </button>
  );

  // --- VIEW 1: MARKETING ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="flex items-center gap-3 mb-4 animate-neural">
          <Brain className="w-10 h-10 text-violet-500" />
          <span className="font-black italic text-2xl uppercase tracking-tighter">The Neural System</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-tight">
          Precision <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Human Intelligence.</span>
        </h1>
        <Button onClick={() => setView('dashboard')} className="h-16 px-12 bg-white text-black font-black uppercase text-xl rounded-none active:scale-95 transition-all">
          Access Terminal <ChevronRight className="ml-2" />
        </Button>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 border-r border-zinc-900 flex flex-col p-6 space-y-8 print:hidden">
        <button onClick={() => setView('marketing')} className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-violet-500 animate-neural" />
          <span className="font-black italic text-sm uppercase tracking-tighter">Neural System</span>
        </button>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Intelligence" id="intelligence" />
          <NavItem icon={<TrendingDown />} label="Retention" id="retention" />
          <NavItem icon={<Users />} label="Engagement" id="engagement" />
          <NavItem icon={<ShieldAlert />} label="Manager Risk" id="risk" />
        </nav>
      </div>

      {/* MAIN */}
      <main className="flex-1 p-12 overflow-y-auto">
        {activeModule === 'intelligence' && (
          <div className="space-y-12">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Intelligence Terminal</h2>
              <div className="flex items-center gap-4">
                 <div className="text-[8px] font-black text-rose-500 uppercase border border-rose-500/20 px-3 py-1 rounded bg-rose-500/5">
                    <Lock className="inline w-2 h-2 mr-1" /> Classified: Tier 1
                 </div>
                 <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] uppercase h-8">Export Report</Button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2"><UserPlus className="w-3 h-3"/> Name</label>
                    <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-500" placeholder="Candidate Name..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2"><Target className="w-3 h-3"/> Data</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 outline-none focus:border-violet-500" placeholder="Paste behavioral data..." />
                  </div>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase h-12">
                    {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Initiate Audit"}
                  </Button>
                </div>
                <div className="pt-8 border-t border-zinc-900">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-4 flex items-center gap-2"><History className="w-3 h-3"/> Registry</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {history?.map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <button onClick={() => {setCurrentAudit(item); setCompareList([]);}} className={`flex-1 text-left p-3 rounded-xl border text-[10px] font-bold uppercase ${currentAudit?.id === item.id ? 'border-violet-500 bg-violet-500/5 text-white' : 'border-zinc-900 text-zinc-600'}`}>
                          {item.name}
                        </button>
                        <button onClick={() => toggleCompare(item)} className={`p-3 rounded-xl border ${compareList.find(a => a.id === item.id) ? 'bg-violet-600 text-white' : 'border-zinc-900 text-zinc-700'}`}><Users className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                {compareList.length === 2 ? (
                  <div className="space-y-8">
                    <div className="bg-zinc-950/30 p-10 rounded-[2rem] border border-violet-900/20 h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0]?.data?.map((d: any, i: number) => ({
                          subject: d.subject, A: d.A, B: compareList[1]?.data[i]?.A || 0
                        }))}>
                          <PolarGrid stroke="#27272a" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                          <Radar name={compareList[0].name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Radar name={compareList[1].name} dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : currentAudit ? (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-950/20 p-10 rounded-[2rem] border border-zinc-900">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                            <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-[11px] font-black uppercase text-violet-500 italic">{currentAudit.name} Signature</h3>
                         <p className="text-sm text-zinc-400 italic">"{currentAudit.summary}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px] border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                    <Fingerprint className="w-16 h-16 text-zinc-800 mb-6" />
                    <h3 className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.5em]">System Standby</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeModule === 'retention' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10 text-left">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Retention Shield</h2>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.3em] mt-2">Enterprise Attrition Monitor</p>
              </div>
              <div className="relative group">
                <input 
                  type="file" accept=".csv" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      Papa.parse(file, {
                        header: true,
                        complete: (res) => alert(`Ingested ${res.data.length} records.`)
                      });
                    }
                  }}
                />
                <Button className="bg-white text-black text-[10px] font-black uppercase h-12 px-8">
                  <UploadCloud className="w-4 h-4 mr-2" /> Ingest CSV
                </Button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard label="Turnover Rate" value="14.2%" trend="-2.1%" color="text-emerald-400" />
              <StatsCard label="Critical Loss" value="08" trend="+3" color="text-rose-500" />
              <StatsCard label="Avg. Tenure" value="3.4 yrs" trend="Stable" color="text-violet-400" />
            </div>

            <Card className="bg-zinc-950 border-zinc-900 p-10 rounded-[2.5rem]">
               <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 tracking-widest">Departmental Heatmap</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ dept: 'Sales', val: 22 }, { dept: 'Eng', val: 12 }, { dept: 'Ops', val: 18 }]}>
                      <XAxis dataKey="dept" stroke="#3f3f46" fontSize={10} />
                      <YAxis stroke="#3f3f46" fontSize={10} />
                      <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}