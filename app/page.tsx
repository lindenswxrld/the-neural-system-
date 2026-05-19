"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Brain, History, Target, BarChart3, 
  Radar as RadarIcon, Share2, Printer, ChevronRight, 
  Zap, Shield, Globe, Activity, User 
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { analyzePerformance } from "./actions";

export default function NeuralSystem() {
  const [view, setView] = useState<'marketing' | 'dashboard'>('marketing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [currentAudit, setCurrentAudit] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize System
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('neural_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // PDF Export Engine
  const handleExport = () => {
    if (!currentAudit) return alert("Run an audit first to export.");
    window.print();
  };

  // AI Analysis Engine
  const handleAnalyze = async () => {
    if (!text) return alert("Please enter behavioral data.");
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance(text);
      const chartData = [
        { subject: 'Openness', A: result.Openness, fullMark: 100 },
        { subject: 'Conscientiousness', A: result.Conscientiousness, fullMark: 100 },
        { subject: 'Extraversion', A: result.Extraversion, fullMark: 100 },
        { subject: 'Agreeableness', A: result.Agreeableness, fullMark: 100 },
        { subject: 'Neuroticism', A: result.Neuroticism, fullMark: 100 },
      ];
      const newAudit = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        data: chartData,
        summary: result.summary,
      };
      const updatedHistory = [newAudit, ...history].slice(0, 5);
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

  // --- VIEW 1: ELITE LANDING PAGE ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-500" />
            <span className="font-black italic tracking-tighter text-lg uppercase">The Neural System</span>
          </div>
          <Button onClick={() => setView('dashboard')} variant="ghost" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-violet-400 transition-all">
            Access Terminal <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-10 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[9px] font-bold uppercase tracking-[0.3em]">
            Institutional Grade Human Capital Intelligence
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic max-w-3xl mx-auto">
            PRECISION <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 uppercase">Human Intelligence.</span>
          </h1>

          <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Stop betting on resumes. Start quantifying <span className="text-zinc-200">Psychological Certainty</span>. 
            The Neural System transforms behavioral data into predictive ROI, allowing elite organizations to identify and retain top-tier talent with 98% accuracy.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
            <Button onClick={() => setView('dashboard')} className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-tighter text-sm rounded-none transition-all active:scale-95">
              Initiate Performance Audit
            </Button>
            <Button variant="outline" className="h-12 px-8 border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900 font-bold uppercase tracking-widest text-[10px] rounded-none">
              Request Enterprise Briefing
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Zap className="text-violet-500 w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">Low-Latency Audit</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Eliminate administrative lag. Our proprietary LPU infrastructure processes complex behavioral datasets in sub-300ms intervals.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Shield className="text-indigo-500 w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">Scientific Rigor</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Built on the foundation of the Five-Factor Model (FFM). We deliver clinical-grade psychological profiles, not generic AI summaries.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Globe className="text-emerald-500 w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">Data Sovereignty</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Fully POPIA and GDPR compliant. Institutional security protocols ensure your most sensitive human data remains secure and private.</p>
          </div>
        </section>

        <footer className="p-12 text-center border-t border-white/5 text-zinc-800 text-[9px] uppercase font-bold tracking-[0.5em]">
          The Neural System &copy; 2026 // Distributed by Neural Performance Group
        </footer>
      </div>
    );
  }

  // --- VIEW 2: THE PERFORMANCE DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-12 font-sans print:p-0">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-8 gap-4 print:hidden">
          <div className="space-y-2">
            <button onClick={() => setView('marketing')} className="flex items-center gap-3 group">
              <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 group-hover:bg-violet-500/20 transition-all">
                <Brain className="w-6 h-6 text-violet-500" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-left">The Neural System</h1>
            </button>
            <p className="text-zinc-600 text-[9px] tracking-[0.4em] uppercase font-bold text-violet-400/60">Performance Analytics // v1.5</p>
          </div>
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="border-zinc-800 bg-transparent text-zinc-500 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-900"
          >
             <Printer className="w-3 h-3 mr-2" /> Export PDF Report
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="w-3 h-3" /> Raw Behavioral Input
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-zinc-800"
                placeholder="Paste performance review..."
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-tighter active:scale-95 transition-all">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Neural Audit"}
              </Button>
            </div>
            <div className="pt-6 border-t border-zinc-900">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <History className="w-3 h-3" /> Audit Registry
              </h3>
              <div className="space-y-2">
                {history.map((item) => (
                  <button key={item.id} onClick={() => setCurrentAudit(item)} className={`w-full text-left p-3 rounded-xl border transition-all ${currentAudit?.id === item.id ? 'border-violet-500/50 bg-violet-500/5' : 'border-zinc-900 hover:border-zinc-700'}`}>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">Session_ID: {item.id.toString().slice(-6)}</div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest">{item.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 print:col-span-12 print:w-full">
            {currentAudit ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900 print:bg-white print:text-black print:border-none">
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
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Psychometric Signature</h3>
                   </div>
                   <p className="text-sm text-zinc-400 print:text-zinc-800 leading-relaxed font-light italic border-l-2 border-violet-500/30 pl-4">
                      "{currentAudit.summary}"
                   </p>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      {currentAudit.data.map((trait: any) => (
                        <div key={trait.subject} className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-600">
                            <span>{trait.subject}</span>
                            <span className="text-zinc-400">{trait.A}%</span>
                          </div>
                          <div className="h-[2px] w-full bg-zinc-900 print:bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500" style={{ width: `${trait.A}%` }} />
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="p-6 bg-zinc-950 rounded-full border border-zinc-900">
                  <BarChart3 className="w-12 h-12 text-zinc-800" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-sm">System Ready</h3>
                  <p className="text-zinc-700 text-xs max-w-xs mx-auto">Awaiting behavioral data input.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}