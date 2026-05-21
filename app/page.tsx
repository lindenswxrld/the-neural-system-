"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Brain, History, Target, BarChart3, 
  Radar as RadarIcon, Share2, Printer, ChevronRight, 
  Zap, Shield, Globe, Activity, AlertTriangle, Fingerprint, Users, TrendingUp
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { analyzePerformance } from "./actions";

export default function NeuralSystem() {
  const [view, setView] = useState<'marketing' | 'dashboard'>('marketing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState("");
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
        // Safety: Ensure every item has a score and darkTriad array
        const validated = parsed.map((item: any) => ({
          ...item,
          score: item.score || 0,
          darkTriad: item.darkTriad || []
        }));
        setHistory(validated);
      }
    } catch (e) {
      console.error("Storage Reset Required", e);
    }
  }, []);

  if (!mounted) return null;

  const handleAnalyze = async () => {
    if (!text) return alert("Enter behavioral data.");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      
      const nScore = Math.floor(
        ((result.Conscientiousness * 0.4) + (result.Openness * 0.3) + (result.Agreeableness * 0.1) + (result.Extraversion * 0.2)) - 
        (((result.Narcissism || 0) + (result.Machiavellianism || 0) + (result.Psychopathy || 0)) / 3)
      );

      const newAudit = {
        id: Date.now(),
        name: `Candidate #${Math.floor(1000 + Math.random() * 9000)}`,
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
        riskWarning: result.risk_warning || "Minimal derailers detected.",
      };

      const updatedHistory = [newAudit, ...history].slice(0, 10);
      setHistory(updatedHistory);
      setCurrentAudit(newAudit);
      localStorage.setItem('neural_history', JSON.stringify(updatedHistory));
      setText("");
    } catch (error) {
      alert("Neural Engine Bottleneck.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCompare = (audit: any) => {
    if (compareList.find(a => a.id === audit.id)) {
      setCompareList(compareList.filter(a => a.id !== audit.id));
    } else if (compareList.length < 2) {
      setCompareList([...compareList, audit]);
    }
  };

  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30 flex flex-col">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full border-b border-white/5">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-500" />
            <span className="font-black italic tracking-tighter text-lg uppercase">The Neural System</span>
          </div>
          <Button onClick={() => setView('dashboard')} variant="ghost" className="text-[10px] uppercase tracking-[0.3em] font-bold">
            Access Terminal <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </nav>
        <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center space-y-10 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[9px] font-bold uppercase tracking-[0.3em]">
            Institutional Human Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-tight">
            Precision <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Human Intelligence.</span>
          </h1>
          <Button onClick={() => setView('dashboard')} className="h-12 px-8 bg-white text-black font-black uppercase text-sm rounded-none active:scale-95 transition-all">
            Initiate Performance Audit
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-8 gap-4 print:hidden">
          <div className="space-y-2">
            <button onClick={() => setView('marketing')} className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20"><Brain className="w-6 h-6 text-violet-500" /></div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">The Neural System</h1>
            </button>
            <p className="text-zinc-600 text-[9px] tracking-[0.4em] uppercase font-bold italic">Analytics Engine // v1.9.2</p>
          </div>
          <Button onClick={() => window.print()} variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold">
             <Printer className="w-3 h-3 mr-2" /> Export Session
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 space-y-6 print:hidden">
            <div className="space-y-4">
              <textarea 
                value={text} onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 outline-none"
                placeholder="Paste performance data..."
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-white text-black font-black text-xs uppercase tracking-tighter">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Audit"}
              </Button>
            </div>
            
            <div className="pt-6 border-t border-zinc-900">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Audit Registry</h3>
              <div className="space-y-2">
                {history?.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <button onClick={() => setCurrentAudit(item)} className={`flex-1 text-left p-3 rounded-xl border text-[10px] uppercase font-bold ${currentAudit?.id === item.id ? 'border-violet-500 bg-violet-500/5' : 'border-zinc-900'}`}>
                      {item.name}
                    </button>
                    <button onClick={() => toggleCompare(item)} className={`p-3 rounded-xl border ${compareList.find(a => a.id === item.id) ? 'bg-violet-600' : 'border-zinc-900 text-zinc-700'}`}>
                      <Users className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-12">
            {compareList.length === 2 ? (
              <div className="bg-zinc-950/30 p-8 rounded-3xl border border-violet-900/20 h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0]?.data?.map((d: any, i: number) => ({
                    subject: d.subject,
                    A: d.A,
                    B: compareList[1]?.data[i]?.A || 0
                  }))}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                    <Radar name={compareList[0].name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Radar name={compareList[1].name} dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : currentAudit ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900">
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
                     <h3 className="text-[10px] font-black uppercase text-violet-500 italic tracking-widest">{currentAudit.name} Signature</h3>
                     <p className="text-sm text-zinc-400 italic leading-relaxed">"{currentAudit.summary}"</p>
                  </div>
                </div>

                <div className="bg-zinc-950/30 p-8 rounded-3xl border border-rose-900/20 space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Toxicity Audit</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {currentAudit.darkTriad?.map((trait: any) => (
                      <div key={trait.name} className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-500">
                          <span>{trait.name}</span>
                          <span className="text-white">{trait.score}%</span>
                        </div>
                        <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-600" style={{ width: `${trait.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                <Fingerprint className="w-12 h-12 text-zinc-800" />
                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">System Standby</h3>
              </div>
            )}

            {history.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2"><TrendingUp className="w-3 h-3"/> Institutional Ranking</h3>
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-zinc-900/50 text-zinc-500 uppercase">
                      <tr>
                        <th className="p-4">Candidate</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4">Risk</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {[...history].sort((a,b) => (b.score || 0) - (a.score || 0)).map((item) => (
                        <tr key={item.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20">
                          <td className="p-4 font-black italic">{item.name}</td>
                          <td className="p-4 text-center font-mono">{item.score || 0}</td>
                          <td className="p-4">
                            {(item.darkTriad || []).some((t: any) => t.score > 60) ? <span className="text-rose-500 font-bold">High Risk</span> : <span className="text-zinc-600">Stable</span>}
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => setCurrentAudit(item)} className="text-violet-500 hover:text-white uppercase font-bold">Review</button>
                          </td>
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