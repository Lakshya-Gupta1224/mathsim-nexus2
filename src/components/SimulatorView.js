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
    <div className="min-h-screen relative flex flex-col" style={{ backgroundColor: '#F4F1EA' }}>
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1C1C1C 1px,transparent 1px),linear-gradient(90deg,#1C1C1C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="sticky top-0 z-50 px-6 py-3">
        <div 
          className="w-full flex items-center justify-between border-2 border-[#1C1C1C] rounded-[12px] bg-white px-4 py-3"
          style={{ boxShadow: '4px 4px 0px #1C1C1C' }}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="text-[14px] text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F4F1EA] rounded-[8px] px-3 py-1.5 transition flex items-center gap-2 font-medium hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              ← Back
            </button>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-[24px]">{simulator.icon}</span>
              <div>
                <h1 className="font-bold text-[16px] text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{simulator.title}</h1>
                <p className="text-[12px] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>{simulator.category}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span>Interactions: <span className="font-bold text-[#A8D5D2]">{interactionCount}</span></span>
            <span>Mastery: <span className="font-bold" style={{ color: '#A8D5D2' }}>{Math.min(mastery, 100)}</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Panel: 4/5 width */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Canvas Panel */}
            <div className="full-height-canvas bg-white border-2 border-[#1C1C1C] rounded-[12px] p-4 flex flex-col" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
              <SimulatorCanvas simulator={simulator} values={values} />
            </div>
            
            {/* Marble overlay — rendered below the canvas when in marble mode */}
            {mode === 'marble' && curveFn && (
              <div className="full-height-canvas bg-white border-2 border-[#1C1C1C] rounded-[12px] p-4 flex flex-col" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
                <MarbleOverlay curveFn={curveFn} accent={simulator.accent} />
              </div>
            )}

            {/* Boat overlay */}
            {mode === 'boat' && (
              <div className="full-height-canvas bg-white border-2 border-[#1C1C1C] rounded-[12px] p-4 flex flex-col" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
                <VectorFieldBoat values={values} simulatorId={simulator.id} accent={simulator.accent} />
              </div>
            )}
          </div>

          {/* Right Control Panel: 1/5 width, sticky */}
          <div className="lg:col-span-1 bg-white border-2 border-[#1C1C1C] rounded-[12px] p-6 flex flex-col gap-5 sticky top-[88px] self-start h-[calc(100vh-120px)] overflow-y-auto" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
            
            {/* Mode toggle */}
            <div className="flex gap-1 border-b-2 border-[#1C1C1C] pb-4 flex-wrap">
              <button 
                onClick={() => { setMode('params'); setIsQuizMode(false); }} 
                className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${mode === 'params' ? 'bg-[#A8D5D2] text-[#1C1C1C] border-2 border-[#1C1C1C]' : 'bg-white text-[#1C1C1C] border-2 border-[#1C1C1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]'}`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Parameters
              </button>
              <button 
                onClick={() => { setMode('quiz'); setIsQuizMode(true); }} 
                className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${mode === 'quiz' ? 'bg-[#A8D5D2] text-[#1C1C1C] border-2 border-[#1C1C1C]' : 'bg-white text-[#1C1C1C] border-2 border-[#1C1C1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]'}`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Quiz
              </button>
              {hasMarble && (
                <button 
                  onClick={() => { setMode('marble'); setIsQuizMode(false); }} 
                  className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${mode === 'marble' ? 'bg-[#F59D8A] text-[#1C1C1C] border-2 border-[#1C1C1C]' : 'bg-white text-[#1C1C1C] border-2 border-[#1C1C1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]'}`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  🎱 Marble
                </button>
              )}
              {hasBoat && (
                <button 
                  onClick={() => { setMode('boat'); setIsQuizMode(false); }} 
                  className={`flex-1 py-2 text-xs font-bold rounded-[8px] transition ${mode === 'boat' ? 'bg-[#CFA8B8] text-[#1C1C1C] border-2 border-[#1C1C1C]' : 'bg-white text-[#1C1C1C] border-2 border-[#1C1C1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]'}`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  🚤 Navigate
                </button>
              )}
            </div>

            {/* View content based on mode */}
            {mode === 'params' && (
              <>
                <div>
                  <h2 className="font-bold text-[16px] text-[#1C1C1C] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Adjust Values</h2>
                  <p className="text-[12px] text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>{simulator.description}</p>
                </div>
                <div className="space-y-5">
                  {simulator.sliders.map(slider => {
                    const sMin = bounds[slider.key]?.min ?? slider.min;
                    const sMax = bounds[slider.key]?.max ?? slider.max;
                    return (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>{slider.label}</label>
                        <span className="text-xs font-bold" style={{ color: '#1C1C1C', fontFamily: 'DM Sans, sans-serif' }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer border-2 border-[#1C1C1C]"
                        style={{
                          background: `linear-gradient(to right, #1C1C1C 0%, #1C1C1C ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA 100%)`,
                          boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bounds:</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Min</label>
                            <input 
                              type="number"
                              value={sMin}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], min: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#A8D5D2] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="-10"
                            />
                          </div>
                          <span className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>to</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Max</label>
                            <input 
                              type="number"
                              value={sMax}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], max: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#A8D5D2] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
                <button
                  onClick={() => { const reset = {}; simulator.sliders.forEach(s => { reset[s.key] = s.default; }); setValues(reset); }}
                  className="mt-auto text-xs text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F4F1EA] rounded-[8px] py-2 transition font-medium hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Reset to defaults
                </button>
              </>
            )}

            {mode === 'quiz' && (
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-[16px] text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Knowledge Check</h2>
                  <button 
                    onClick={handleGenerateQuiz} 
                    disabled={isGeneratingQuiz}
                    className="text-xs bg-[#A8D5D2] text-[#1C1C1C] hover:bg-[#CFA8B8] px-3 py-1.5 rounded-[8px] transition flex items-center gap-1 disabled:opacity-50 border-2 border-[#1C1C1C] font-medium hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {isGeneratingQuiz ? 'Generating...' : '✨ AI Quiz'}
                  </button>
                </div>
                
                {quizError && (
                  <div className="p-3 mb-4 rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {quizError}
                  </div>
                )}

                {activeQuiz && activeQuiz.examQuestion && activeQuiz.examQuestion !== 'N/A' ? (
                  <>
                    <h2 className="font-bold text-[14px] text-[#1C1C1C] mb-4 leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>{activeQuiz.examQuestion}</h2>
                    <div className="space-y-3">
                      {activeQuiz.options.map((opt, i) => {
                        let btnClass = "w-full text-left p-3 rounded-[8px] border-2 text-sm transition font-mono ";
                        if (!quizState.answered) btnClass += "border-[#1C1C1C] bg-white text-[#1C1C1C] hover:bg-[#F4F1EA] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]";
                        else if (opt === activeQuiz.answer) btnClass += "border-[#4CAF50] bg-[#4CAF50] text-white";
                        else if (opt === quizState.selected) btnClass += "border-[#F59D8A] bg-[#F59D8A] text-white";
                        else btnClass += "border-[#1C1C1C] bg-white text-[#1C1C1C]/50";

                        return (
                          <button 
                            key={i} 
                            onClick={() => handleAnswer(opt)} 
                            className={btnClass} 
                            disabled={quizState.answered}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizState.answered && (
                      <div className="mt-6 p-4 rounded-[8px] bg-white border-2 border-[#1C1C1C]">
                        <p className="text-xs text-[#1C1C1C] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}><span className="font-bold text-[#A8D5D2]">Theory:</span> {activeQuiz.theory}</p>
                        <button 
                          onClick={() => setQuizState({answered: false, correct: false, selected: null})} 
                          className="w-full text-xs text-[#1C1C1C] border-2 border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#F4F1EA] rounded-[8px] py-2 transition font-medium hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
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
                  <h2 className="font-bold text-[14px] text-[#1C1C1C] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>🎱 Marble Run</h2>
                  <p className="text-[12px] text-[#1C1C1C] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Adjust the curve with sliders above, then drop a marble! 
                    Tweak the equation so the marble rolls into the golden target bucket.
                  </p>
                </div>
                <div className="p-3 rounded-[8px] bg-[#F59D8A] border-2 border-[#1C1C1C]" style={{ boxShadow: '2px 2px 0px #1C1C1C' }}>
                  <p className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                        <label className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>{slider.label}</label>
                        <span className="text-xs font-mono text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer border-2 border-[#1C1C1C]"
                        style={{
                          background: `linear-gradient(to right, #F59D8A 0%, #F59D8A ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA 100%)`,
                          boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bounds:</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Min</label>
                            <input 
                              type="number"
                              value={sMin}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], min: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#F59D8A] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="-10"
                            />
                          </div>
                          <span className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>to</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Max</label>
                            <input 
                              type="number"
                              value={sMax}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], max: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#F59D8A] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            {mode === 'boat' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-bold text-[14px] text-[#1C1C1C] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>🚤 Vector Navigation</h2>
                  <p className="text-[12px] text-[#1C1C1C] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Use WASD or arrow keys to navigate the boat through the vector field. 
                    Tweak the field equations to steer through obstacles to the goal!
                  </p>
                </div>
                <div className="p-3 rounded-[8px] bg-[#CFA8B8] border-2 border-[#1C1C1C]" style={{ boxShadow: '2px 2px 0px #1C1C1C' }}>
                  <p className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                        <label className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>{slider.label}</label>
                        <span className="text-xs font-mono text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {typeof values[slider.key] === 'number'
                            ? values[slider.key] % 1 === 0 ? values[slider.key] : values[slider.key].toFixed(2)
                            : values[slider.key]}
                        </span>
                      </div>
                      <input
                        type="range" min={sMin} max={sMax} step={slider.step}
                        value={values[slider.key]} onChange={e => handleSliderChange(slider.key, e.target.value)}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer border-2 border-[#1C1C1C]"
                        style={{
                          background: `linear-gradient(to right, #CFA8B8 0%, #CFA8B8 ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA ${((values[slider.key] - sMin) / (sMax - sMin)) * 100}%, #F4F1EA 100%)`,
                          boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#1C1C1C] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bounds:</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Min</label>
                            <input 
                              type="number"
                              value={sMin}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], min: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#CFA8B8] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="-10"
                            />
                          </div>
                          <span className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>to</span>
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-[#1C1C1C]" style={{ fontFamily: 'Inter, sans-serif' }}>Max</label>
                            <input 
                              type="number"
                              value={sMax}
                              onChange={(e) => setBounds(prev => ({ ...prev, [slider.key]: { ...prev[slider.key], max: parseFloat(e.target.value) || 0 } }))}
                              className="bg-white border-2 border-[#1C1C1C] rounded-[6px] px-2 py-1 w-16 text-center text-[#1C1C1C] focus:border-[#CFA8B8] focus:outline-none transition"
                              style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </div>
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