"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Brain, History, Target, BarChart3, 
  Radar as RadarIcon, Share2, Printer, ChevronRight, 
  Zap, Shield, Globe, Activity, AlertTriangle, Fingerprint
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
      
      const newAudit = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        // Big Five Data
        data: [
          { subject: 'Openness', A: result.Openness },
          { subject: 'Conscientiousness', A: result.Conscientiousness },
          { subject: 'Extraversion', A: result.Extraversion },
          { subject: 'Agreeableness', A: result.Agreeableness },
          { subject: 'Neuroticism', A: result.Neuroticism },
        ],
        // Dark Triad Data
        darkTriad: [
          { name: 'Narcissism', score: result.Narcissism },
          { name: 'Machiavellianism', score: result.Machiavellianism },
          { name: 'Psychopathy', score: result.Psychopathy },
        ],
        summary: result.summary,
        riskWarning: result.risk_warning || "No significant derailers detected in current dataset.",
      };

      const updatedHistory = [newAudit, ...history].slice(0, 5);
      setHistory(updatedHistory);
      setCurrentAudit(newAudit);
      localStorage.setItem('neural_history', JSON.stringify(updatedHistory));
      setText("");
    } catch (error) {
      console.error(error);
      alert("Neural Engine Bottleneck. Check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- VIEW 1: ELITE LANDING PAGE ---
  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-500" />
            <span className="font-black italic tracking-tighter text-lg uppercase">The Neural System</span>
          </div>
          <Button onClick={() => setView('dashboard')} variant="ghost" className="text-[10px] uppercase tracking-[0.3em] font-bold hover:text-violet-400 transition-all">
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

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
            <Button onClick={() => setView('dashboard')} className="h-12 px-8 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-tighter text-sm rounded-none transition-all active:scale-95">
              Initiate Performance Audit
            </Button>
            <Button variant="outline" className="h-12 px-8 border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-900 font-bold uppercase tracking-widest text-[10px] rounded-none">
              Request Enterprise Briefing
            </Button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-violet-500">
               <Zap className="w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">Low-Latency Audit</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Sub-300ms processing of complex behavioral datasets using proprietary LPU infrastructure.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-500">
               <Shield className="w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">Toxicity Shield</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Advanced Dark Triad detection to identify Machiavellianism and workplace derailers before they impact culture.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
               <Globe className="w-4 h-4" />
               <h3 className="font-bold text-xs uppercase tracking-widest">POPIA Sovereignty</h3>
            </div>
            <p className="text-zinc-500 text-xs leading-6 font-light">Institutional-grade security ensuring your most sensitive human data remains secure and private.</p>
          </div>
        </section>
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
            <p className="text-zinc-600 text-[9px] tracking-[0.4em] uppercase font-bold text-violet-400/60">Performance Analytics // v1.8</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="border-zinc-800 bg-transparent text-zinc-500 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-900">
             <Printer className="w-3 h-3 mr-2" /> Export PDF Report
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target className="w-3 h-3" /> Raw Behavioral Input
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-40 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-zinc-800"
                placeholder="Paste interview transcript or performance review..."
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black text-xs uppercase tracking-tighter active:scale-95 transition-all">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Performance Audit"}
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

          <div className="lg:col-span-8 print:col-span-12 print:w-full space-y-12">
            {currentAudit ? (
              <div className="animate-in fade-in zoom-in duration-500 space-y-12">
                {/* Section 1: Performance Radar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900 print:bg-white print:text-black">
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
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Performance Signature</h3>
                     </div>
                     <p className="text-sm text-zinc-400 leading-relaxed font-light italic border-l-2 border-violet-500/30 pl-4">"{currentAudit.summary}"</p>
                  </div>
                </div>

                {/* Section 2: Toxicity Audit (Dark Triad) */}
                <div className="space-y-6 bg-zinc-950/30 p-8 rounded-3xl border border-rose-900/20 print:bg-white">
                  <div className="flex items-center gap-2 text-rose-500">
                     <AlertTriangle className="w-4 h-4" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Toxicity Audit // Risk Profile</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl">
                    <p className="text-[11px] text-rose-200 leading-relaxed italic">
                      <span className="font-bold uppercase mr-2 text-rose-500 tracking-tighter">Analysis:</span>
                      {currentAudit.riskWarning}
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
          </div>
        </div>
      </div>
    </div>
  );
}