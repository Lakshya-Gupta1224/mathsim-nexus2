import React, { useState, useEffect } from 'react';
import { SIMULATORS, CATEGORIES } from '../simulators';
import { getUser } from '../auth';

function StatCard({ label, value, accent, icon }) {
  return (
    <div 
      className="relative bg-white border-2 border-[#1C1C1C] rounded-[12px] p-5 transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1C1C1C]"
      style={{ boxShadow: '4px 4px 0px #1C1C1C' }}
    >
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <p className="text-[32px] font-bold text-[#1C1C1C] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
      <p className="text-[14px] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
    </div>
  );
}

function SimCard({ sim, masteryScore, onClick }) {
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Algebra': return '#A8D5D2';
      case 'Trigonometry': return '#CFA8B8';
      case 'Calculus': return '#F59D8A';
      default: return '#A8D5D2';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`relative border-2 border-[#1C1C1C] rounded-[12px] p-5 transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1C1C1C] text-left`}
      style={{ 
        backgroundColor: getCategoryColor(sim.category),
        boxShadow: '4px 4px 0px #1C1C1C'
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[36px] font-bold text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{sim.icon}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {sim.category}
          </span>
          {sim.locked && <span className="text-[16px]">🔒</span>}
        </div>
      </div>
      <h3 className="font-bold text-[16px] text-[#1C1C1C] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{sim.title}</h3>
      <p className="text-[12px] text-[#1C1C1C] leading-relaxed mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{sim.description}</p>
      
      <div className="pt-3 border-t-2 border-[#1C1C1C]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mastery</span>
          <div className="flex items-center gap-1">
            <div className="h-2 border-2 border-[#1C1C1C] rounded flex-1 bg-white overflow-hidden">
              <div
                className="h-full bg-[#1C1C1C] transition-all duration-500"
                style={{ width: `${Math.min(masteryScore, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-[#1C1C1C] ml-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              ⭐ {Math.min(masteryScore, 100)}
            </span>
          </div>
        </div>
      </div>
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

  // Draw AI Intuition Index chart
  useEffect(() => {
    if (userData?.intuitionIndex > 0) {
      const canvas = document.getElementById('intuitionChart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      
      // Sample data points for the line graph
      const data = [20, 35, 45, 40, 60, 75, 85, 90, 95, userData.intuitionIndex];
      const width = canvas.width;
      const height = canvas.height;
      const padding = 10;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw axes
      ctx.strokeStyle = '#1C1C1C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.stroke();

      // Draw data line
      ctx.strokeStyle = '#F59D8A';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const xStep = (width - 2 * padding) / (data.length - 1);
      const yScale = (height - 2 * padding) / 100;

      data.forEach((point, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (point * yScale);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw data points
      ctx.fillStyle = '#1C1C1C';
      data.forEach((point, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (point * yScale);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [userData?.intuitionIndex]);

  const filteredSims = activeCategory === 'All'
    ? SIMULATORS
    : SIMULATORS.filter(s => s.category === activeCategory);

  const mastery = userData?.masteryScores || {};

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#F4F1EA' }}>
      {/* Grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-3">
        <div 
          className="w-full flex items-center justify-between border-2 border-[#1C1C1C] rounded-[12px] bg-white px-4 py-3"
          style={{ boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[28px] font-bold text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>∑</span>
            <span className="text-[20px] font-bold text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>MathSim</span>
            <span className="text-[20px] font-bold" style={{ fontFamily: 'DM Sans, sans-serif', color: '#A8D5D2' }}>Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] border-2 border-[#1C1C1C]" />
              <span className="text-[14px] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>{user.id}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-[12px] text-[#1C1C1C] border-b-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F4F1EA] transition-all duration-200 pb-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Simulator cards (main content) */}
          <div className="flex-1 min-w-0">
            {/* Category filter */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {['All', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[14px] px-5 py-2 rounded-[20px] border-2 border-[#1C1C1C] font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#A8D5D2] text-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1C1C1C]'
                  }`}
                  style={{ 
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: activeCategory === cat ? '4px 4px 0px #1C1C1C' : 'none'
                  }}
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
              <h2 className="text-xs uppercase tracking-widest text-[#1C1C1C] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your Stats</h2>
              <StatCard label="Simulators Run" value={userData?.simulatorsRan || 0} icon="" />
              <StatCard label="Slider Moves" value={userData?.sliderInteractions || 0} icon="" />
              <StatCard
                label="Intuition Index"
                value={`${userData?.intuitionIndex || 0}%`}
                icon=""
              />
              <StatCard
                label="Sims Explored"
                value={`${Object.keys(mastery).length} / 33`}
                icon={""}
              />

              {/* AI Intuition Index */}
              {userData?.intuitionIndex > 0 && (
                <div 
                  className="relative bg-white border-2 border-[#1C1C1C] rounded-[12px] p-5 transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1C1C1C]"
                  style={{ boxShadow: '4px 4px 0px #1C1C1C' }}
                >
                  <div className="mb-3">
                    <span className="text-sm font-medium text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>AI Intuition Index</span>
                  </div>
                  <div className="h-20 border-2 border-[#1C1C1C] rounded bg-white relative overflow-hidden">
                    <canvas 
                      id="intuitionChart" 
                      width="150" 
                      height="80"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
