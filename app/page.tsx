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
    const saved = localStorage.getItem('neural_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleExport = () => {
    if (!currentAudit && compareList.length < 2) return alert("Select an audit to export.");
    window.print();
  };

  const handleAnalyze = async () => {
    if (!text) return alert("Please enter behavioral data.");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      
      // NEW: Neural Ranking Score Logic (Day 4)
      const neuralScore = Math.floor(
        ((result.Conscientiousness * 0.4) + 
         (result.Openness * 0.3) + 
         (result.Agreeableness * 0.1) + 
         (result.Extraversion * 0.2)) - 
         ((result.Narcissism + result.Machiavellianism + result.Psychopathy) / 3)
      );

      const newAudit = {
        id: Date.now(),
        name: `Candidate #${Math.floor(1000 + Math.random() * 9000)}`,
        score: neuralScore,
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
    } else {
      alert("Comparison limited to 2 signatures for precision.");
    }
  };

  // --- VIEW 1: ELITE LANDING PAGE ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
          <div className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-violet-500" />
            <span className="font-black italic tracking-tighter text-lg uppercase">The Neural System</span>
          </div>
          <Button onClick={() => setView('dashboard')} variant="ghost" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-violet-400">
            Access Terminal <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </nav>

        <section className="py-24 px-6 text-center space-y-10 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[9px] font-bold uppercase tracking-[0.3em]">
            Institutional Grade Human Capital Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic max-w-3xl mx-auto uppercase">
            Precision <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Human Intelligence.</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Stop betting on resumes. Start quantifying <span className="text-zinc-200 uppercase font-bold tracking-tighter">Psychological Certainty</span>. 
            The Neural System transforms behavioral data into predictive ROI and toxicity audits with 98% accuracy.
          </p>
          <div className="pt-6">
            <Button onClick={() => setView('dashboard')} className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-tighter text-sm rounded-none active:scale-95 transition-all">
              Initiate Performance Audit
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // --- VIEW 2: THE PERFORMANCE DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12 font-sans print:p-0">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-8 gap-4 print:hidden">
          <div className="space-y-2">
            <button onClick={() => setView('marketing')} className="flex items-center gap-3 group">
              <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 group-hover:bg-violet-500/20 transition-all">
                <Brain className="w-6 h-6 text-violet-500" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-left">The Neural System</h1>
            </button>
            <p className="text-zinc-600 text-[9px] tracking-[0.4em] uppercase font-bold text-violet-400/60 font-mono italic">
              {compareList.length === 2 ? "Comparative Intelligence Mode Active" : "Performance Analytics // v1.9"}
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" className="border-zinc-800 bg-transparent text-zinc-500 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-900">
             <Printer className="w-3 h-3 mr-2" /> Export Session
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6 print:hidden">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="w-3 h-3" /> Raw Behavioral Input
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-zinc-800"
                placeholder="Paste performance data..."
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-10 bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-tighter transition-all">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Audit"}
              </Button>
            </div>
            
            <div className="pt-6 border-t border-zinc-900">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <History className="w-3 h-3" /> Audit Registry
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentAudit(item)} 
                      className={`flex-1 text-left p-3 rounded-xl border transition-all ${currentAudit?.id === item.id ? 'border-violet-500/50 bg-violet-500/5' : 'border-zinc-900 hover:border-zinc-700'}`}
                    >
                      <div className="text-[10px] font-bold text-zinc-400 uppercase">{item.name}</div>
                      <div className="text-[9px] text-zinc-600 italic">Score: {item.score}</div>
                    </button>
                    <button 
                      onClick={() => toggleCompare(item)}
                      className={`p-3 rounded-xl border transition-all ${compareList.find(a => a.id === item.id) ? 'bg-violet-600 border-violet-500 text-white' : 'border-zinc-900 text-zinc-700 hover:text-zinc-400'}`}
                    >
                      <Users className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-9 print:col-span-12 space-y-12">
            {compareList.length === 2 ? (
              /* COMPARISON VIEW */
              <div className="animate-in fade-in zoom-in duration-500 space-y-8">
                <div className="bg-zinc-950/30 p-8 rounded-3xl border border-violet-900/20">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500 mb-8 text-center">Head-to-Head Overlap</h3>
                  <div className="h-[400px] w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={compareList[0].data.map((d: any, i: number) => ({
                          subject: d.subject,
                          A: d.A,
                          B: compareList[1]?.data[i]?.A || 0
                        }))}>
                          <PolarGrid stroke="#27272a" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name={compareList[0].name} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                          <Radar name={compareList[1].name} dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            ) : currentAudit ? (
              /* SINGLE VIEW */
              <div className="animate-in fade-in zoom-in duration-500 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900">
                  <div className="h-[300px] w-full">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAudit.data}>
                          <PolarGrid stroke="#27272a" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                          <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-2 text-violet-500">
                        <RadarIcon className="w-4 h-4" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{currentAudit.name} Signature</h3>
                     </div>
                     <p className="text-sm text-zinc-400 leading-relaxed font-light italic border-l-2 border-violet-500/30 pl-4">"{currentAudit.summary}"</p>
                  </div>
                </div>
                
                {/* Dark Triad Risk Audit */}
                <div className="bg-zinc-950/30 p-8 rounded-3xl border border-rose-900/20">
                  <div className="flex items-center gap-2 text-rose-500 mb-6">
                     <AlertTriangle className="w-4 h-4" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Toxicity Audit // Dark Triad Risk</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {currentAudit.darkTriad.map((trait: any) => (
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
                  <div className="mt-6 bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
                    <p className="text-[10px] text-rose-300 italic leading-relaxed">
                      <span className="font-bold uppercase mr-2 text-rose-500">Risk Warning:</span> {currentAudit.riskWarning}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6">
                <Fingerprint className="w-12 h-12 text-zinc-800" />
                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">System Standby</h3>
              </div>
            )}

            {/* INSTITUTIONAL LEADERBOARD (NEW DAY 4 FEATURE) */}
            {history.length > 0 && (
              <div className="space-y-6 print:hidden animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-2 text-zinc-500">
                  <TrendingUp className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Talent Ranking</h3>
                </div>
                <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/20">
                        <th className="p-4 text-zinc-500 font-black uppercase tracking-widest">Candidate ID</th>
                        <th className="p-4 text-zinc-500 font-black uppercase tracking-widest text-center">Neural Score</th>
                        <th className="p-4 text-zinc-500 font-black uppercase tracking-widest">Risk Level</th>
                        <th className="p-4 text-zinc-500 font-black uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.sort((a,b) => b.score - a.score).map((item) => (
                        <tr key={item.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all">
                          <td className="p-4 font-black italic">{item.name}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded font-mono ${item.score > 70 ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-500 bg-zinc-900'}`}>
                              {item.score}
                            </span>
                          </td>
                          <td className="p-4">
                            {item.darkTriad.some((t: any) => t.score > 60) ? (
                              <span className="text-rose-500 font-black uppercase tracking-tighter animate-pulse">High Risk</span>
                            ) : (
                              <span className="text-zinc-600 uppercase tracking-tighter">Stable</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => setCurrentAudit(item)} className="text-violet-500 hover:text-white font-bold uppercase tracking-tighter">Review Profile</button>
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