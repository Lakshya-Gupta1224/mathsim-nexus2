import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { recordSliderInteraction, recordSimulatorRun, getUser, updateUserStats } from '../auth';
import { SIMULATOR_META } from '../simulators';
import SimulatorCanvas from './SimulatorCanvas';

export default function SimulatorView({ user, simulator, onBack }) {
  const initialValues = useMemo(() => {
    const vals = {};
    simulator.sliders.forEach(s => { vals[s.key] = s.default; });
    return vals;
  }, [simulator.sliders]);

  const [values, setValues] = useState(initialValues);
  const [interactionCount, setInteractionCount] = useState(0);
  const [mastery, setMastery] = useState(0);

  // New Quiz States
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizState, setQuizState] = useState({ answered: false, correct: false, selected: null });
  const meta = SIMULATOR_META[simulator.id];

  useEffect(() => {
    recordSimulatorRun(user.id);
    const u = getUser(user.id);
    setMastery(u?.masteryScores?.[simulator.id] || 0);
  }, [user.id, simulator.id]);

  const handleSliderChange = useCallback((key, value) => {
    setValues(prev => ({ ...prev, [key]: parseFloat(value) }));
    setInteractionCount(c => c + 1);
    recordSliderInteraction(user.id, simulator.id);
    const u = getUser(user.id);
    setMastery(u?.masteryScores?.[simulator.id] || 0);
  }, [user.id, simulator.id]);

  // Quiz Logic
  const handleAnswer = (option) => {
    if (quizState.answered) return;
    const isCorrect = option === meta.answer;
    setQuizState({ answered: true, correct: isCorrect, selected: option });

    if (isCorrect) {
      const u = getUser(user.id);
      const currentMastery = u?.masteryScores?.[simulator.id] || 0;
      // Give them 20 mastery points for a correct answer
      updateUserStats(user.id, { masteryScores: { ...(u?.masteryScores || {}), [simulator.id]: currentMastery + 20 } });
      setMastery(currentMastery + 20);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative flex flex-col">
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-sm border border-white/10 hover:border-white/30 rounded-lg px-3 py-1.5 transition flex items-center gap-2">
            ← Back
          </button>
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xl">{simulator.icon}</span>
            <div>
              <h1 className="text-white font-semibold text-sm">{simulator.title}</h1>
              <p className="text-slate-500 text-xs">{simulator.category}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
            <span>Interactions: <span className="text-cyan-400 font-semibold">{interactionCount}</span></span>
            <span>Mastery: <span style={{ color: simulator.accent }} className="font-semibold">{Math.min(mastery, 100)}</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Canvas Panel */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
            <SimulatorCanvas simulator={simulator} values={values} />
          </div>

          {/* Right Control/Quiz Panel */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            
            {/* Toggle Buttons */}
            <div className="flex gap-2 border-b border-white/10 pb-4">
              <button 
                onClick={() => setIsQuizMode(false)} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${!isQuizMode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                Parameters
              </button>
              <button 
                onClick={() => setIsQuizMode(true)} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${isQuizMode ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                Knowledge Quiz
              </button>
            </div>

            {/* View Switching Logic */}
            {!isQuizMode ? (
              // --- PARAMETERS VIEW ---
              <>
                <div>
                  <h2 className="text-white font-semibold text-sm mb-1">Adjust Values</h2>
                  <p className="text-slate-500 text-xs">{simulator.description}</p>
                </div>
                <div className="space-y-5">
                  {simulator.sliders.map(slider => (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-slate-300">{slider.label}</label>
                        <span className="text-xs font-mono font-bold" style={{ color: simulator.accent }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={slider.min} max={slider.max} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${simulator.accent} 0%, ${simulator.accent} ${((values[slider.key] - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.1) ${((values[slider.key] - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-slate-600 text-xs mt-1">
                        <span>{slider.min}</span><span>{slider.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { const reset = {}; simulator.sliders.forEach(s => { reset[s.key] = s.default; }); setValues(reset); }}
                  className="mt-auto text-xs text-slate-500 hover:text-white border border-white/10 hover:border-white/30 rounded-lg py-2 transition"
                >
                  Reset to defaults
                </button>
              </>
            ) : (
              // --- QUIZ VIEW ---
              <div className="flex flex-col flex-1">
                {meta && meta.examQuestion && meta.examQuestion !== 'N/A' ? (
                  <>
                    <h2 className="text-white font-semibold text-sm mb-4">{meta.examQuestion}</h2>
                    <div className="space-y-3">
                      {meta.options.map((opt, i) => {
                        let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition font-mono ";
                        if (!quizState.answered) btnClass += "border-white/10 hover:border-cyan-500/50 hover:bg-white/5 text-slate-300";
                        else if (opt === meta.answer) btnClass += "border-green-500 bg-green-500/20 text-white";
                        else if (opt === quizState.selected) btnClass += "border-red-500 bg-red-500/20 text-white";
                        else btnClass += "border-white/5 text-slate-600 opacity-50";

                        return (
                          <button key={i} onClick={() => handleAnswer(opt)} className={btnClass} disabled={quizState.answered}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizState.answered && (
                      <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-300 mb-3"><span className="text-cyan-400 font-bold">Theory:</span> {meta.theory}</p>
                        <button onClick={() => setQuizState({answered: false, correct: false, selected: null})} className="w-full text-xs text-slate-500 hover:text-white border border-white/10 rounded py-2 transition">
                          Retry Question
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-slate-500 text-sm">No quiz data available for this visualizer yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: white; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 0 8px rgba(0,0,0,0.5); cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: white; border: 2px solid rgba(255,255,255,0.3); cursor: pointer; }
      `}</style>
    </div>
  );
}