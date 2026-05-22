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
          darkTriad: item.darkTriad || []
        })));
      }
    } catch (e) { console.error(e); }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text || !candidateName) return alert("Enter Name and Data.");
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

  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center text-center p-6 space-y-10">
         <div className="flex items-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-violet-500 animate-neural" />
            <span className="font-black italic tracking-tighter text-2xl uppercase">The Neural System</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight max-w-4xl">
            Precision <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 font-black">Human Intelligence.</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg font-light">Quantify psychological certainty and eliminate workplace toxicity with AI-driven performance analytics.</p>
          <Button onClick={() => setView('dashboard')} className="h-14 px-10 bg-white text-black font-black uppercase text-lg rounded-none active:scale-95 transition-all">
            Access Terminal
          </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12 print:p-0">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* INSTITUTIONAL HEADER */}
        <header className="flex justify-between items-start border-b border-zinc-900 pb-8 print:border-zinc-200">
          <div className="text-left space-y-2">
            <button onClick={() => setView('marketing')} className="flex items-center gap-3 print:hidden">
              <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20"><Brain className="w-6 h-6 text-violet-500 animate-neural" /></div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">The Neural System</h1>
            </button>
            <div className="hidden print:block text-black font-black text-2xl italic tracking-tighter">THE NEURAL SYSTEM</div>
            <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-[0.4em] italic print:text-zinc-500">v1.9.6 // Institutional Grade</p>
          </div>

          <div className="flex flex-col items-end gap-3">
             <div className="flex gap-2 print:hidden">
                <div className="flex items-center gap-2 text-[8px] font-black text-rose-500 uppercase tracking-[0.2em] border border-rose-500/20 px-2 py-1 rounded bg-rose-500/5">
                   <Lock className="w-2 h-2" /> Classified: Tier 1
                </div>
                <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase h-7">
                  <Printer className="w-3 h-3 mr-2" /> Export
                </Button>
             </div>
             <div className="text-[8px] text-zinc-600 uppercase tracking-widest font-mono print:text-zinc-400">
                POPIA COMPLIANT // SESSION_ID_{currentAudit?.id || 'NULL'}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-6 print:hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2"><UserPlus className="w-3 h-3"/> Candidate Name</label>
                <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-500 transition-all" placeholder="Enter Name..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-2"><Target className="w-3 h-3"/> Behavioral Data</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 outline-none focus:border-violet-500 transition-all" placeholder="Paste Data..." />
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase h-12 transition-all active:scale-95">
                {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Initiate Audit"}
              </Button>
            </div>
            
            <div className="pt-6 border-t border-zinc-900">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase mb-4 flex items-center gap-2"><History className="w-3 h-3"/> Audit Registry</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {history?.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <button onClick={() => {setCurrentAudit(item); setCompareList([]);}} className={`flex-1 text-left p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${currentAudit?.id === item.id ? 'border-violet-500 bg-violet-500/5 text-white' : 'border-zinc-900 text-zinc-500 hover:border-zinc-700'}`}>
                      {item.name}
                    </button>
                    <button onClick={() => toggleCompare(item)} className={`p-3 rounded-xl border transition-all ${compareList.find(a => a.id === item.id) ? 'bg-violet-600 text-white' : 'border-zinc-900 text-zinc-700 hover:text-zinc-400'}`}><Users className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN TERMINAL */}
          <div className="lg:col-span-9 space-y-12">
            {compareList.length === 2 ? (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="bg-zinc-950/30 p-8 rounded-3xl border border-violet-900/20 h-[450px]">
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
                <Card className="bg-violet-950/10 border-violet-500/20"><CardContent className="p-6">
                  <h3 className="text-violet-500 text-[10px] font-black uppercase mb-4 flex items-center gap-2"><Brain className="w-3 h-3"/> Comparative Intelligence</h3>
                  {isComparing ? <div className="flex items-center gap-2 text-zinc-500 text-xs italic"><Loader2 className="animate-spin w-3 h-3" /> Synthesizing differentials...</div> : <p className="text-sm text-zinc-300 italic leading-relaxed">"{compSummary}"</p>}
                </CardContent></Card>
              </div>
            ) : currentAudit ? (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900 print:bg-white print:border-zinc-200">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                        <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase text-violet-500 italic tracking-[0.2em]">{currentAudit.name} Signature</h3>
                     <p className="text-sm text-zinc-400 italic leading-relaxed print:text-zinc-800">"{currentAudit.summary}"</p>
                  </div>
                </div>

                <div className="bg-zinc-950/30 p-8 rounded-3xl border border-rose-900/20 space-y-6 print:bg-white print:border-rose-200">
                  <h3 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-2 tracking-[0.2em]"><AlertTriangle className="w-3 h-3"/> Toxicity Risk Audit</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {currentAudit.darkTriad?.map((trait: any) => (
                      <div key={trait.name} className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-500"><span>{trait.name}</span><span className="text-white print:text-black">{trait.score}%</span></div>
                        <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-rose-600" style={{ width: `${trait.score}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                    <p className="text-[10px] text-rose-300 italic print:text-rose-800">Note: {currentAudit.riskWarning || "No significant derailers detected."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                <Fingerprint className="w-12 h-12 text-zinc-800" />
                <h3 className="text-zinc-500 font-bold uppercase text-xs mt-4 tracking-widest">System Standby</h3>
              </div>
            )}

            {/* LEADERBOARD */}
            {history.length > 0 && (
              <div className="space-y-6 print:hidden">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-[0.2em]"><TrendingUp className="w-3 h-3"/> Institutional Ranking</h3>
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-zinc-900/50 text-zinc-500 uppercase font-black"><tr><th className="p-4">Candidate</th><th className="p-4 text-center">Score</th><th className="p-4">Risk Status</th><th className="p-4 text-right">Action</th></tr></thead>
                    <tbody className="text-white font-medium">
                      {[...history].sort((a,b) => b.score - a.score).map((item) => (
                        <tr key={item.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all">
                          <td className="p-4 font-black italic uppercase tracking-tighter">{item.name}</td>
                          <td className="p-4 text-center font-mono">{item.score}</td>
                          <td className="p-4">{item.darkTriad.some((t: any) => t.score > 60) ? <span className="text-rose-500 font-black uppercase text-[8px]">High Alert</span> : <span className="text-zinc-600 uppercase text-[8px]">Stable</span>}</td>
                          <td className="p-4 text-right"><button onClick={() => setCurrentAudit(item)} className="text-violet-500 hover:text-white uppercase font-black transition-colors">Review</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRINT FOOTER DISCLAIMER */}
            <footer className="hidden print:block mt-20 pt-8 border-t border-zinc-200 text-[9px] text-zinc-500">
              <p className="font-black uppercase tracking-[0.3em] mb-3 text-black">Neural System Intelligence Report // CONFIDENTIAL</p>
              <p className="leading-relaxed">This psychometric signature was generated via proprietary Neural Architectures. Data provided is for professional evaluation purposes only and must be handled in accordance with the Protection of Personal Information Act (POPIA). Final organizational decisions remain the responsibility of the presiding Human Capital Lead.</p>
              <div className="mt-6 flex justify-between uppercase font-bold text-[8px] text-zinc-400">
                <span>Verification ID: {currentAudit?.id || 'N/A'}</span>
                <span>Distributed by Linden Performance Architectures</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}