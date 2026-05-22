"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, BarChart3, TrendingDown, Users, 
  ShieldAlert, LayoutDashboard, ClipboardList, 
  UploadCloud, FileText, LogOut, ChevronRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Module = 'intelligence' | 'retention' | 'engagement' | 'risk';

export default function NeuralPlatform() {
  const [activeModule, setActiveModule] = useState<Module>('intelligence');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // SIDEBAR NAVIGATION COMPONENT
  const Sidebar = () => (
    <div className="w-64 border-r border-zinc-900 flex flex-col p-6 space-y-8 print:hidden">
      <div className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-violet-500 animate-neural" />
        <span className="font-black italic text-sm uppercase tracking-tighter">Neural System</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard />} label="Intelligence" id="intelligence" />
        <NavItem icon={<TrendingDown />} label="Retention" id="retention" />
        <NavItem icon={<Users />} label="Engagement" id="engagement" />
        <NavItem icon={<ShieldAlert />} label="Manager Risk" id="risk" />
      </nav>

      <div className="pt-6 border-t border-zinc-900">
        <div className="flex items-center gap-3 p-2 text-zinc-500">
          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white">HR</div>
          <div className="text-[10px] font-bold uppercase tracking-widest">Admin Mode</div>
        </div>
      </div>
    </div>
  );

  const NavItem = ({ icon, label, id }: { icon: any, label: string, id: Module }) => (
    <button 
      onClick={() => setActiveModule(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeModule === id ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}`}
    >
      {React.cloneElement(icon, { size: 16 })}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <Sidebar />
      
      <main className="flex-1 p-12 overflow-y-auto">
        {/* MODULE: INTELLIGENCE (Your existing psychometric tool) */}
        {activeModule === 'intelligence' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-8">Intelligence Terminal</h2>
            {/* ... Your existing Dashboard logic here ... */}
            <p className="text-zinc-500 italic">Accessing Psychometric Core...</p>
          </div>
        )}

        {/* MODULE: RETENTION (New Feature) */}
        {activeModule === 'retention' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Retention Shield</h2>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.3em] mt-2">Critical Skill Loss Prevention</p>
              </div>
              <Button className="bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-widest h-10 px-6 hover:bg-zinc-800">
                <UploadCloud className="w-4 h-4 mr-2" /> Ingest HR Data (CSV)
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard label="Overall Turnover" value="14.2%" trend="-2.1%" color="text-emerald-400" />
              <StatsCard label="Critical Skill Loss" value="8" trend="+3" color="text-rose-500" />
              <StatsCard label="Avg. Tenure" value="3.4 yrs" trend="Stable" color="text-violet-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="bg-zinc-950 border-zinc-900 p-8 rounded-[2rem]">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 tracking-widest">Turnover by Department</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { dept: 'Eng', val: 12 }, { dept: 'Sales', val: 24 }, { dept: 'Ops', val: 18 }, { dept: 'HR', val: 5 }
                    ]}>
                      <XAxis dataKey="dept" stroke="#52525b" fontSize={10} />
                      <YAxis stroke="#52525b" fontSize={10} />
                      <Tooltip contentStyle={{ background: '#000', border: '#27272a' }} />
                      <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="bg-zinc-950 border-zinc-900 p-8 rounded-[2rem] flex flex-col justify-center">
                 <h3 className="text-[10px] font-black uppercase text-violet-500 mb-6 tracking-widest flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Neural Insight
                 </h3>
                 <p className="text-xl italic font-light leading-relaxed">
                   "Sales department turnover is 2x the company average. High correlation with **Manager ID: 0x88**. Immediate stay-interviews recommended for critical account managers."
                 </p>
                 <div className="mt-8 flex gap-3">
                    <Button className="bg-white text-black text-[10px] font-black uppercase rounded-none px-6">Generate Playbook</Button>
                    <Button variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] font-black uppercase rounded-none px-6">Dismiss</Button>
                 </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const StatsCard = ({ label, value, trend, color }: any) => (
  <Card className="bg-zinc-950 border-zinc-900 p-6 rounded-2xl">
    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex justify-between items-end">
      <h4 className={`text-3xl font-black italic ${color}`}>{value}</h4>
      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{trend}</span>
    </div>
  </Card>
);