// ZoomControls.js — floating overlay for zoom/pan controls
import React from 'react';

export default function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F1EA] text-sm font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
        style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        title="Zoom out"
      >−</button>
      <span
        className="px-2 py-1 rounded-[8px] bg-white border-2 border-[#1C1C1C] text-xs font-mono text-[#1C1C1C] min-w-[48px] text-center select-none"
        style={{ fontFamily: 'Inter, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        title="Double-click canvas to reset"
      >{Math.round(zoom * 100)}%</span>
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F1EA] text-sm font-bold transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
        style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        title="Zoom in"
      >+</button>
      <button
        onClick={onReset}
        className="w-7 h-7 flex items-center justify-center rounded-[8px] bg-white border-2 border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#F4F1EA] text-xs transition ml-1 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
        style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '2px 2px 0px #1C1C1C' }}
        title="Reset view"
      >⟳</button>
    </div>
  );
}
