"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, Activity, Target } from "lucide-react";
import { analyzePerformance } from "./actions"; // Importing the "Brain"

export default function NeuralSystemDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("Waiting for input data...");
  
  const [traits, setTraits] = useState([
    { name: "Openness", score: 0, color: "bg-violet-500", desc: "Creativity and curiosity" },
    { name: "Conscientiousness", score: 0, color: "bg-blue-500", desc: "Organization and discipline" },
    { name: "Extraversion", score: 0, color: "bg-emerald-500", desc: "Social energy" },
    { name: "Agreeableness", score: 0, color: "bg-amber-500", desc: "Cooperativeness" },
    { name: "Neuroticism", score: 0, color: "bg-rose-500", desc: "Emotional sensitivity" },
  ]);

  const handleAnalyze = async () => {
    if (!text) return alert("Please enter text to analyze.");
    
    setIsAnalyzing(true);

    try {
      // Calling the Groq AI "Brain"
      const result = await analyzePerformance(text);
      
      // Updating the bars with REAL AI data
      setTraits([
        { name: "Openness", score: result.Openness, color: "bg-violet-500", desc: "Creativity and curiosity" },
        { name: "Conscientiousness", score: result.Conscientiousness, color: "bg-blue-500", desc: "Organization and discipline" },
        { name: "Extraversion", score: result.Extraversion, color: "bg-emerald-500", desc: "Social energy" },
        { name: "Agreeableness", score: result.Agreeableness, color: "bg-amber-500", desc: "Cooperativeness" },
        { name: "Neuroticism", score: result.Neuroticism, color: "bg-rose-500", desc: "Emotional sensitivity" },
      ]);

      setSummary(result.summary || result.executive_summary);

    } catch (error) {
      console.error("AI Error:", error);
      alert("Neural Engine encountered a data bottleneck. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 font-sans selection:bg-violet-500/30">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-violet-500" />
              <h1 className="text-3xl font-bold tracking-tighter italic">THE NEURAL SYSTEM</h1>
            </div>
            <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">Performance Analytics // v1.0</p>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest">
                <Activity className="w-3 h-3" /> System Stable
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3" /> Behavioral Data Input
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-sm text-zinc-300 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-zinc-700 leading-relaxed"
                placeholder="Paste an interview transcript, a performance review, or a candidate bio..."
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-tighter transition-all active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Decoding Neural Patterns...
                </div>
              ) : (
                "Run Performance Audit"
              )}
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traits.map((trait) => (
                <Card key={trait.name} className="bg-zinc-950 border-zinc-900 overflow-hidden group hover:border-zinc-700 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                      {trait.name}
                      <span className="text-white font-mono">{trait.score}%</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${trait.color} transition-all duration-[1500ms] ease-in-out`} 
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-3 font-medium uppercase tracking-tighter italic">{trait.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Summary Card */}
            <Card className="bg-violet-950/5 border-violet-500/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-violet-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Executive Performance Summary</h3>
                <p className="text-sm text-zinc-400 leading-7 font-light italic">
                  "{summary}"
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}