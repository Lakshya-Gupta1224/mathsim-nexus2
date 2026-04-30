import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { recordSliderInteraction, recordSimulatorRun, getUser, updateUserStats } from '../auth';
import { SIMULATOR_META, MARBLE_SIMS, BOAT_SIMS, CURVE_FN_FACTORIES } from '../simulators';
import SimulatorCanvas from './SimulatorCanvas';
import MarbleOverlay from './simulators/MarbleOverlay';
import VectorFieldBoat from './simulators/VectorFieldBoat';
import { generateDynamicQuiz } from '../utils/aiQuizGenerator';

export default function SimulatorView({ user, simulator, onBack }) {
  const initialValues = useMemo(() => {
    const vals = {};
    simulator.sliders.forEach(s => { vals[s.key] = s.default; });
    return vals;
  }, [simulator.sliders]);

  const [values, setValues] = useState(initialValues);

  const [bounds, setBounds] = useState(() => {
    const bds = {};
    simulator.sliders.forEach(s => { bds[s.key] = { min: s.min, max: s.max }; });
    return bds;
  });
  const [interactionCount, setInteractionCount] = useState(0);
  const [mastery, setMastery] = useState(0);

  // Quiz States
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizState, setQuizState] = useState({ answered: false, correct: false, selected: null });
  const meta = SIMULATOR_META[simulator.id];
  const [dynamicQuiz, setDynamicQuiz] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const activeQuiz = dynamicQuiz || meta;

  // Mode: 'params' | 'quiz' | 'marble' | 'boat'
  const [mode, setMode] = useState('params');

  const hasMarble = MARBLE_SIMS.has(simulator.id);
  const hasBoat = BOAT_SIMS.has(simulator.id);

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
    const isCorrect = option === activeQuiz?.answer;
    setQuizState({ answered: true, correct: isCorrect, selected: option });

    if (isCorrect) {
      const u = getUser(user.id);
      const currentMastery = u?.masteryScores?.[simulator.id] || 0;
      updateUserStats(user.id, { masteryScores: { ...(u?.masteryScores || {}), [simulator.id]: currentMastery + 20 } });
      setMastery(currentMastery + 20);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setQuizError(null);
    try {
      const newQuiz = await generateDynamicQuiz(simulator);
      setDynamicQuiz(newQuiz);
      setQuizState({ answered: false, correct: false, selected: null });
    } catch (err) {
      let msg = err.message;
      if (msg.includes('API Key missing')) {
        const key = prompt('Please enter your Gemini API Key:');
        if (key) {
          localStorage.setItem('GEMINI_API_KEY', key);
          handleGenerateQuiz();
          return;
        }
      }
      setQuizError(msg);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Get curve function for marble mode
  const curveFn = useMemo(() => {
    if (!hasMarble) return null;
    const factory = CURVE_FN_FACTORIES[simulator.id];
    return factory ? factory(values) : null;
  }, [hasMarble, simulator.id, values]);

  const is3D = simulator.is3D;

  return (
    <div className="min-h-screen bg-slate-950 relative flex flex-col">
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-6 py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
            <span>Interactions: <span className="text-cyan-400 font-semibold">{interactionCount}</span></span>
            <span>Mastery: <span style={{ color: simulator.accent }} className="font-semibold">{Math.min(mastery, 100)}</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Panel: 4/5 width */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Canvas Panel */}
            <div className="full-height-canvas backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
              <SimulatorCanvas simulator={simulator} values={values} />
            </div>
            
            {/* Marble overlay — rendered below the canvas when in marble mode */}
            {mode === 'marble' && curveFn && (
              <div className="full-height-canvas backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                <MarbleOverlay curveFn={curveFn} accent={simulator.accent} />
              </div>
            )}

            {/* Boat overlay */}
            {mode === 'boat' && (
              <div className="full-height-canvas backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                <VectorFieldBoat values={values} simulatorId={simulator.id} accent={simulator.accent} />
              </div>
            )}
          </div>

          {/* Right Control Panel: 1/5 width, sticky */}
          <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 sticky top-[88px] self-start h-[calc(100vh-120px)] overflow-y-auto">
            
            {/* Mode toggle */}
            <div className="flex gap-1 border-b border-white/10 pb-4 flex-wrap">
              <button 
                onClick={() => { setMode('params'); setIsQuizMode(false); }} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${mode === 'params' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                Parameters
              </button>
              <button 
                onClick={() => { setMode('quiz'); setIsQuizMode(true); }} 
                className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${mode === 'quiz' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                Quiz
              </button>
              {hasMarble && (
                <button 
                  onClick={() => { setMode('marble'); setIsQuizMode(false); }} 
                  className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${mode === 'marble' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' : 'text-slate-500 hover:text-white'}`}>
                  🎱 Marble
                </button>
              )}
              {hasBoat && (
                <button 
                  onClick={() => { setMode('boat'); setIsQuizMode(false); }} 
                  className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition ${mode === 'boat' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' : 'text-slate-500 hover:text-white'}`}>
                  🚤 Navigate
                </button>
              )}
            </div>

            {/* View content based on mode */}
            {mode === 'params' && (
              <>
                <div>
                  <h2 className="text-white font-semibold text-sm mb-1">Adjust Values</h2>
                  <p className="text-slate-500 text-xs">{simulator.description}</p>
                </div>
                <div className="space-y-5">
                  {simulator.sliders.map(slider => {
                    const sMin = bounds[slider.key]?.min ?? slider.min;
                    const sMax = bounds[slider.key]?.max ?? slider.max;
                    return (
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
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${simulator.accent} 0%, ${simulator.accent} ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.1) ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-slate-600 text-xs mt-1">
                        <input 
                          type="number"
                          value={sMin}
                          onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], min: parseFloat(e.target.value) || 0 } }))}
                          className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 outline-none w-16 text-left appearance-none"
                        />
                        <input 
                          type="number"
                          value={sMax}
                          onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], max: parseFloat(e.target.value) || 0 } }))}
                          className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 outline-none w-16 text-right appearance-none"
                        />
                      </div>
                    </div>
                  )})}
                </div>
                <button
                  onClick={() => { const reset = {}; simulator.sliders.forEach(s => { reset[s.key] = s.default; }); setValues(reset); }}
                  className="mt-auto text-xs text-slate-500 hover:text-white border border-white/10 hover:border-white/30 rounded-lg py-2 transition"
                >
                  Reset to defaults
                </button>
              </>
            )}

            {mode === 'quiz' && (
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold text-sm">Knowledge Check</h2>
                  <button 
                    onClick={handleGenerateQuiz} 
                    disabled={isGeneratingQuiz}
                    className="text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 px-3 py-1.5 rounded transition flex items-center gap-1 disabled:opacity-50">
                    {isGeneratingQuiz ? 'Generating...' : '✨ AI Quiz'}
                  </button>
                </div>
                
                {quizError && (
                  <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {quizError}
                  </div>
                )}

                {activeQuiz && activeQuiz.examQuestion && activeQuiz.examQuestion !== 'N/A' ? (
                  <>
                    <h2 className="text-white font-semibold text-sm mb-4 leading-relaxed">{activeQuiz.examQuestion}</h2>
                    <div className="space-y-3">
                      {activeQuiz.options.map((opt, i) => {
                        let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition font-mono ";
                        if (!quizState.answered) btnClass += "border-white/10 hover:border-cyan-500/50 hover:bg-white/5 text-slate-300";
                        else if (opt === activeQuiz.answer) btnClass += "border-green-500 bg-green-500/20 text-white";
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
                        <p className="text-xs text-slate-300 mb-3"><span className="text-cyan-400 font-bold">Theory:</span> {activeQuiz.theory}</p>
                        <button onClick={() => setQuizState({answered: false, correct: false, selected: null})} className="w-full text-xs text-slate-500 hover:text-white border border-white/10 rounded py-2 transition">
                          Retry Question
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-slate-500 text-sm">No quiz data available for this visualizer yet. Click "AI Quiz" to generate one!</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'marble' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-white font-semibold text-sm mb-1">🎱 Marble Run</h2>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Adjust the curve with sliders above, then drop a marble! 
                    Tweak the equation so the marble rolls into the golden target bucket.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-xs text-amber-200/80">
                    <span className="font-bold">How to play:</span> Use the Parameters tab to shape the curve, 
                    then come back here. Position your drop point, and hit Drop!
                  </p>
                </div>
                {/* Sliders still accessible in marble mode */}
                <div className="space-y-4">
                  {simulator.sliders.map(slider => {
                    const sMin = bounds[slider.key]?.min ?? slider.min;
                    const sMax = bounds[slider.key]?.max ?? slider.max;
                    return (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400">{slider.label}</label>
                        <span className="text-xs font-mono" style={{ color: simulator.accent }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${simulator.accent}80 0%, ${simulator.accent}80 ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.08) ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.08) 100%)`
                        }}
                      />
                    </div>
                  )})}
                </div>
              </div>
            )}

            {mode === 'boat' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-white font-semibold text-sm mb-1">🚤 Vector Navigation</h2>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Use WASD or arrow keys to navigate the boat through the vector field. 
                    Tweak the field equations to steer through obstacles to the goal!
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-blue-200/80">
                    <span className="font-bold">Controls:</span> W/↑ forward, S/↓ backward, A/← left, D/→ right
                  </p>
                </div>
                {/* Sliders for adjusting the field */}
                <div className="space-y-4">
                  {simulator.sliders.map(slider => {
                    const sMin = bounds[slider.key]?.min ?? slider.min;
                    const sMax = bounds[slider.key]?.max ?? slider.max;
                    return (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400">{slider.label}</label>
                        <span className="text-xs font-mono" style={{ color: simulator.accent }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${simulator.accent}80 0%, ${simulator.accent}80 ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.08) ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, rgba(255,255,255,0.08) 100%)`
                        }}
                      />
                    </div>
                  )})}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: white; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 0 8px rgba(0,0,0,0.5); cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: white; border: 2px solid rgba(255,255,255,0.3); cursor: pointer; }
        .full-height-canvas canvas {
          height: calc(100vh - 280px) !important;
          min-height: 400px !important;
          max-height: 1000px !important;
        }
      `}
      </style>
    </div>
  );
}