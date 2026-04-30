// ZoomControls.js — floating overlay for zoom/pan controls
import React from 'react';

export default function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:text-white hover:border-white/30 text-sm font-bold transition"
        title="Zoom out"
      >−</button>
      <span
        className="px-2 py-1 rounded-lg bg-slate-800/80 backdrop-blur border border-white/10 text-xs font-mono text-slate-400 min-w-[48px] text-center select-none"
        title="Double-click canvas to reset"
      >{Math.round(zoom * 100)}%</span>
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:text-white hover:border-white/30 text-sm font-bold transition"
        title="Zoom in"
      >+</button>
      <button
        onClick={onReset}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:text-white hover:border-white/30 text-xs transition ml-1"
        title="Reset view"
      >⟳</button>
    </div>
  );
}
