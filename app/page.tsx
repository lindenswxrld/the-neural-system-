"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Brain, History, Target, BarChart3, 
  Printer, ChevronRight, Zap, Shield, Globe, 
  AlertTriangle, Fingerprint, Users, TrendingUp, UserPlus, Lock
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { analyzePerformance, compareCandidates } from "./actions";

export default function NeuralSystem() {
  const [view, setView] = useState<'marketing' | 'dashboard'>('marketing');
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
    try {
      const saved = localStorage.getItem('neural_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({
          ...item,
          score: item.score || 0,
          darkTriad: item.darkTriad || [],
          name: item.name || "Unknown"
        })));
      }
    } catch (e) { console.error(e); }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("Missing Candidate Identity or Behavioral Data.");
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
    } catch (error) { alert("Neural Engine Bottleneck."); }
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

  // --- VIEW 1: ELITE LANDING PAGE ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black -z-10" />
        
        <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Brain className="w-10 h-10 text-violet-500 animate-neural" />
          <span className="font-black italic tracking-tighter text-2xl uppercase">The Neural System</span>
        </div>

        <section className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[9px] font-bold uppercase tracking-[0.4em]">
            Institutional Human Intelligence // v1.9.7
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-[0.9] uppercase">
            Precision <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Human Intelligence.</span>
          </h1>

          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate the cost of bad hires. Quantify <span className="text-zinc-200 font-bold">Psychological Certainty</span> and detect workplace toxicity with 98% predictive accuracy.
          </p>

          <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button onClick={() => setView('dashboard')} className="h-16 px-12 bg-white text-black font-black uppercase text-xl rounded-none hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Access Terminal <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </section>

        <footer className="fixed bottom-10 text-zinc-800 text-[10px] font-bold uppercase tracking-[0.5em]">
          Linden Performance Architectures &copy; 2026
        </footer>
      </div>
    );
  }

  // --- VIEW 2: THE PERFORMANCE DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12 print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-start border-b border-zinc-900 pb-8 print:border-zinc-200">
          <div className="text-left space-y-2">
            <button onClick={() => setView('marketing')} className="flex items-center gap-3 group print:hidden">
              <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 group-hover:bg-violet-500/20 transition-all">
                <Brain className="w-6 h-6 text-violet-500 animate-neural" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">The Neural System</h1>
            </button>
            <div className="hidden print:block text-black font-black text-2xl italic tracking-tighter uppercase">THE NEURAL SYSTEM</div>
            <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-[0.4em] italic print:text-zinc-400">Institutional Grade // Performance Analytics</p>
          </div>

          <div className="flex flex-col items-end gap-3">
             <div className="flex gap-3 print:hidden">
                <div className="flex items-center gap-2 text-[8px] font-black text-rose-500 uppercase tracking-[0.3em] border border-rose-500/20 px-3 py-1.5 rounded bg-rose-500/5">
                   <Lock className="w-3 h-3" /> Classified: Tier 1
                </div>
                <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase h-9 hover:bg-zinc-900">
                  <Printer className="w-4 h-4 mr-2" /> Export
                </Button>
             </div>
             <div className="text-[8px] text-zinc-700 uppercase tracking-widest font-mono print:text-zinc-400">
                POPIA_SECURE // SESSION_{currentAudit?.id || 'PENDING'}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-8 print:hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><UserPlus className="w-3 h-3"/> Candidate Name</label>
                <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-500 transition-all" placeholder="E.g. ARTHUR PENDAGON" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2 tracking-widest"><Target className="w-3 h-3"/> Behavioral Data</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 outline-none focus:border-violet-500 transition-all" placeholder="Paste assessment data..." />
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase h-12 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Initiate Audit"}
              </Button>
            </div>
            
            <div className="pt-8 border-t border-zinc-900">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-6 flex items-center gap-2 tracking-widest"><History className="w-3 h-3"/> Audit Registry</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history?.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <button onClick={() => {setCurrentAudit(item); setCompareList([]);}} className={`flex-1 text-left p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${currentAudit?.id === item.id ? 'border-violet-500 bg-violet-500/5 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}>
                      {item.name}
                    </button>
                    <button onClick={() => toggleCompare(item)} className={`p-3 rounded-xl border transition-all ${compareList.find(a => a.id === item.id) ? 'bg-violet-600 text-white border-violet-500' : 'border-zinc-900 text-zinc-700 hover:text-zinc-400'}`}><Users className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN TERMINAL */}
          <div className="lg:col-span-9 space-y-12">
            {compareList.length === 2 ? (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="bg-zinc-950/30 p-10 rounded-[2rem] border border-violet-900/20 h-[500px] shadow-inner">
                  <h3 className="text-[10px] font-black uppercase text-violet-500 tracking-[0.5em] mb-12 text-center">Head-to-Head Psychometric Overlap</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0]?.data?.map((d: any, i: number) => ({
                      subject: d.subject, A: d.A, B: compareList[1]?.data[i]?.A || 0
                    }))}>
                      <PolarGrid stroke="#27272a" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                      <Radar name={compareList[0].name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Radar name={compareList[1].name} dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                      <Legend iconType="diamond" />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <Card className="bg-violet-950/5 border-violet-500/10 rounded-2xl overflow-hidden"><CardContent className="p-8">
                  <h3 className="text-violet-500 text-[10px] font-black uppercase mb-4 tracking-widest flex items-center gap-2"><Brain className="w-4 h-4"/> Comparative Intelligence Differential</h3>
                  {isComparing ? <div className="flex items-center gap-3 text-zinc-600 text-xs italic"><Loader2 className="animate-spin w-4 h-4" /> Synthesizing candidate data...</div> : <p className="text-sm text-zinc-300 italic leading-loose font-light">"{compSummary}"</p>}
                </CardContent></Card>
              </div>
            ) : currentAudit ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-950/20 p-10 rounded-[2rem] border border-zinc-900 shadow-2xl print:bg-white print:border-zinc-200">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                        <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-6">
                     <h3 className="text-[11px] font-black uppercase text-violet-500 italic tracking-[0.3em]">{currentAudit.name} Signature</h3>
                     <p className="text-base text-zinc-300 italic leading-relaxed font-light print:text-zinc-800">"{currentAudit.summary}"</p>
                  </div>
                </div>

                <div className="bg-rose-950/5 p-10 rounded-[2.5rem] border border-rose-900/10 space-y-8 print:bg-white print:border-rose-100">
                  <h3 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-2 tracking-[0.4em]"><AlertTriangle className="w-4 h-4"/> Toxicity Risk Diagnostic</h3>
                  <div className="grid grid-cols-3 gap-8 text-left">
                    {currentAudit.darkTriad?.map((trait: any) => (
                      <div key={trait.name} className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-black text-zinc-600 tracking-tighter"><span>{trait.name}</span><span className="text-white print:text-black font-mono">{trait.score}%</span></div>
                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]" style={{ width: `${trait.score}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-rose-500/5 border-l-2 border-rose-500 rounded-r-lg">
                    <p className="text-[11px] text-rose-300 italic font-light print:text-rose-900">Note: {currentAudit.riskWarning || "No critical derailers identified."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] border-2 border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 group hover:border-violet-500/20 transition-all">
                <div className="p-8 bg-zinc-950 rounded-full border border-zinc-900 mb-6 group-hover:scale-110 transition-transform">
                  <Fingerprint className="w-16 h-16 text-zinc-800 group-hover:text-violet-500/40" />
                </div>
                <h3 className="text-zinc-600 font-bold uppercase text-[10px] tracking-[0.5em]">Institutional Standby // Awaiting Input</h3>
              </div>
            )}

            {/* LEADERBOARD */}
            {history.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-zinc-900 print:hidden">
                <h3 className="text-[10px] font-black uppercase text-zinc-600 flex items-center gap-2 tracking-[0.4em]"><TrendingUp className="w-4 h-4"/> Institutional Performance Ranking</h3>
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-zinc-900/30 text-zinc-500 uppercase font-black tracking-widest"><tr className="border-b border-zinc-900"><th className="p-6">Candidate Identity</th><th className="p-6 text-center">Neural Score</th><th className="p-6">Risk Profile</th><th className="p-6 text-right">Terminal</th></tr></thead>
                    <tbody className="text-white font-medium">
                      {[...history].sort((a,b) => b.score - a.score).map((item) => (
                        <tr key={item.id} className="border-b border-zinc-900/50 hover:bg-violet-500/[0.02] transition-all group">
                          <td className="p-6 font-black italic tracking-tighter group-hover:text-violet-400">{item.name}</td>
                          <td className="p-6 text-center font-mono text-lg">{item.score}</td>
                          <td className="p-6">{item.darkTriad.some((t: any) => t.score > 60) ? <span className="text-rose-500 font-black uppercase text-[9px] animate-pulse px-2 py-1 bg-rose-500/10 rounded">High Alert</span> : <span className="text-emerald-500 uppercase text-[9px] font-bold">Stable</span>}</td>
                          <td className="p-6 text-right"><button onClick={() => setCurrentAudit(item)} className="text-violet-500 hover:text-white uppercase font-black tracking-tighter bg-violet-500/5 px-4 py-2 rounded-lg border border-violet-500/20 hover:bg-violet-500 transition-all">Review</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}