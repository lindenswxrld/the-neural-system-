"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, Activity, Target, History, User, BarChart3 } from "lucide-react";
import { analyzePerformance } from "./actions";

export default function NeuralSystemDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [currentAudit, setCurrentAudit] = useState<any>(null);

  // Load history from browser memory on startup
  useEffect(() => {
    const saved = localStorage.getItem('neural_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleAnalyze = async () => {
    if (!text) return alert("Please enter behavioral data.");
    setIsAnalyzing(true);

    try {
      const result = await analyzePerformance(text);
      const newAudit = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        traits: [
          { name: "Openness", score: result.Openness, color: "bg-violet-500" },
          { name: "Conscientiousness", score: result.Conscientiousness, color: "bg-blue-500" },
          { name: "Extraversion", score: result.Extraversion, color: "bg-emerald-500" },
          { name: "Agreeableness", score: result.Agreeableness, color: "bg-amber-500" },
          { name: "Neuroticism", score: result.Neuroticism, color: "bg-rose-500" },
        ],
        summary: result.summary,
      };

      const updatedHistory = [newAudit, ...history].slice(0, 5); // Keep last 5
      setHistory(updatedHistory);
      setCurrentAudit(newAudit);
      localStorage.setItem('neural_history', JSON.stringify(updatedHistory));

    } catch (error) {
      alert("Neural Engine Bottleneck.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 font-sans selection:bg-violet-500/30">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-violet-500" />
              <h1 className="text-3xl font-bold tracking-tighter italic uppercase">The Neural System</h1>
            </div>
            <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-bold text-violet-400/60">Performance Analytics // v1.2</p>
          </div>
          <div className="text-right space-y-1">
             <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Active Audit Session</div>
             <div className="text-xs font-mono text-emerald-500 flex items-center justify-end gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 0x8821_SECURE
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/50">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Audits
              </h3>
              <div className="space-y-3">
                {history.length === 0 && <p className="text-[10px] text-zinc-700 italic">No historical data found...</p>}
                {history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setCurrentAudit(item)}
                    className="w-full text-left p-3 rounded-lg border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
                  >
                    <div className="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors">Audit #{item.id.toString().slice(-4)}</div>
                    <div className="text-[9px] text-zinc-600">{item.date}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3" /> Input Module
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-zinc-800"
                placeholder="Enter behavioral raw data..."
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="w-full h-10 bg-white text-black hover:bg-zinc-200 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run Performance Audit"}
              </Button>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-3 space-y-8">
            {currentAudit ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAudit.traits.map((trait: any) => (
                    <Card key={trait.name} className="bg-zinc-950 border-zinc-900 overflow-hidden">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{trait.name}</span>
                          <span className="text-xl font-mono font-bold text-white">{trait.score}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-900 rounded-full">
                          <div 
                            className={`h-full ${trait.color} transition-all duration-[1500ms]`} 
                            style={{ width: `${trait.score}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-zinc-950 border-zinc-900 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-violet-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" /> Executive Cognitive Summary
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-light italic">
                      "{currentAudit.summary}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-[400px] border border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-zinc-950 rounded-full border border-zinc-900">
                  <User className="w-8 h-8 text-zinc-800" />
                </div>
                <p className="text-xs text-zinc-700 uppercase tracking-widest">Initial System Standby. Awaiting Input.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}