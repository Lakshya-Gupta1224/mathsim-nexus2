import React, { useState, useEffect } from 'react';
import { SIMULATORS, CATEGORIES } from '../simulators';
import { getUser } from '../auth';

function StatCard({ label, value, accent }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color: accent }}>{value}</p>
    </div>
  );
}

function SimCard({ sim, masteryScore, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left backdrop-blur-xl bg-gradient-to-br ${sim.color} border border-white/10 hover:border-white/25 rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl group`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{sim.icon}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400">{sim.category}</span>
      </div>
      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-cyan-300 transition">{sim.title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed">{sim.description}</p>
      {masteryScore > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Mastery</span>
            <span className="text-xs" style={{ color: sim.accent }}>{Math.min(masteryScore, 100)}</span>
          </div>
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(masteryScore, 100)}%`, background: sim.accent }}
            />
          </div>
        </div>
      )}
    </button>
  );
}

export default function Dashboard({ user, onLogout, onOpenSimulator }) {
  const [userData, setUserData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const u = getUser(user.id);
    setUserData(u);
  }, [user.id]);

  // Refresh stats when window gains focus (after returning from simulator)
  useEffect(() => {
    const refresh = () => {
      const u = getUser(user.id);
      setUserData(u);
    };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [user.id]);

  const filteredSims = activeCategory === 'All'
    ? SIMULATORS
    : SIMULATORS.filter(s => s.category === activeCategory);

  const mastery = userData?.masteryScores || {};

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-6 py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">∑ MathSim <span className="text-cyan-400">Nexus</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-400 text-sm">{user.id}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-white text-xs border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Simulator cards (main content) */}
          <div className="flex-1 min-w-0">
            {/* Category filter */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-4 py-1.5 rounded-full border transition ${
                    activeCategory === cat
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Simulator grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSims.map(sim => (
                <SimCard
                  key={sim.id}
                  sim={sim}
                  masteryScore={mastery[sim.id] || 0}
                  onClick={() => onOpenSimulator(sim)}
                />
              ))}
            </div>
          </div>

          {/* Right: Stats sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Your Stats</h2>
              <StatCard label="Simulators Run" value={userData?.simulatorsRan || 0} accent="#22d3ee" />
              <StatCard label="Slider Moves" value={userData?.sliderInteractions || 0} accent="#6366f1" />
              <StatCard
                label="Intuition Index"
                value={`${userData?.intuitionIndex || 0}%`}
                accent="#84cc16"
              />
              <StatCard
                label="Sims Explored"
                value={`${Object.keys(mastery).length} / 20`}
                accent="#f59e0b"
              />

              {/* Intuition bar */}
              {userData?.intuitionIndex > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300 font-medium">AI Intuition Index</span>
                    <span className="text-cyan-400 font-bold text-sm">{userData.intuitionIndex}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${userData.intuitionIndex}%`,
                        background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1)'
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Based on depth of slider interactions across all simulators.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
