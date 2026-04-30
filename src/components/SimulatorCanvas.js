import React from 'react';

// Original 20
import LinearCanvas from './simulators/LinearCanvas';
import ParabolaCanvas from './simulators/ParabolaCanvas';
import PolynomialCanvas from './simulators/PolynomialCanvas';
import LogarithmCanvas from './simulators/LogarithmCanvas';
import SystemSolverCanvas from './simulators/SystemSolverCanvas';
import UnitCircleCanvas from './simulators/UnitCircleCanvas';
import WaveMakerCanvas from './simulators/WaveMakerCanvas';
import FourierCanvas from './simulators/FourierCanvas';
import TriangleCanvas from './simulators/TriangleCanvas';
import TangentVisCanvas from './simulators/TangentVisCanvas';
import TangentSlopeCanvas from './simulators/TangentSlopeCanvas';
import RiemannCanvas from './simulators/RiemannCanvas';
import TaylorCanvas from './simulators/TaylorCanvas';
import LimitCanvas from './simulators/LimitCanvas';
import AreaCurveCanvas from './simulators/AreaCurveCanvas';
import NormalDistCanvas from './simulators/NormalDistCanvas';
import VectorAdderCanvas from './simulators/VectorAdderCanvas';
import PolygonCanvas from './simulators/PolygonCanvas';
import RegressionCanvas from './simulators/RegressionCanvas';
import LorenzCanvas from './simulators/LorenzCanvas';

// 10 New Advanced Simulators
import MatrixCanvas from './simulators/MatrixCanvas';
import PolarRoseCanvas from './simulators/PolarRoseCanvas';
import LissajousCanvas from './simulators/LissajousCanvas';
import ModuloCircleCanvas from './simulators/ModuloCircleCanvas';
import BezierCanvas from './simulators/BezierCanvas';
import SlopeFieldCanvas from './simulators/SlopeFieldCanvas';
import ComplexRootsCanvas from './simulators/ComplexRootsCanvas';
import CobwebCanvas from './simulators/CobwebCanvas';
import ConicCanvas from './simulators/ConicCanvas';
import EpicycleCanvas from './simulators/EpicycleCanvas';

// 3D WebGL Simulators
import TopographyCanvas from './simulators/TopographyCanvas';
import Lorenz3DCanvas from './simulators/Lorenz3DCanvas';

const MAP = {
  linear: LinearCanvas, parabola: ParabolaCanvas, polynomial: PolynomialCanvas,
  logarithm: LogarithmCanvas, systemsolver: SystemSolverCanvas, unitcircle: UnitCircleCanvas,
  wavemaker: WaveMakerCanvas, fourier: FourierCanvas, triangle: TriangleCanvas,
  tangentvis: TangentVisCanvas, tangentslope: TangentSlopeCanvas, riemann: RiemannCanvas,
  taylor: TaylorCanvas, limit: LimitCanvas, areaundercurve: AreaCurveCanvas,
  normaldist: NormalDistCanvas, vectoradder: VectorAdderCanvas, polygon: PolygonCanvas,
  regression: RegressionCanvas, lorenz: LorenzCanvas,
  
  // New Additions
  matrix: MatrixCanvas, polarrose: PolarRoseCanvas, lissajous: LissajousCanvas,
  modulocircle: ModuloCircleCanvas, bezier: BezierCanvas, slopefield: SlopeFieldCanvas,
  complexroots: ComplexRootsCanvas, cobweb: CobwebCanvas, conic: ConicCanvas,
  epicycle: EpicycleCanvas,

  // 3D WebGL
  topography: TopographyCanvas, lorenz3d: Lorenz3DCanvas,
};

export default function SimulatorCanvas({ simulator, values }) {
  const Component = MAP[simulator.id];

  // Safety Net 1: We forgot to add it to the MAP entirely
  if (!Component) {
    return <div className="text-slate-500 text-sm p-4">Simulator not found in the MAP.</div>;
  }

  // Safety Net 2: The file exists, but it's empty, not saved, or missing "export default"
  // If it's broken, it returns an empty object instead of a function. This stops the crash!
  if (typeof Component !== 'function') {
    return (
      <div className="p-5 border border-red-500/30 bg-red-500/10 rounded-xl m-4">
        <h3 className="text-red-400 font-bold mb-2">Error Loading "{simulator.title}"</h3>
        <p className="text-slate-300 text-sm">
          React found the file, but nobody is home. This means the file is either empty, 
          wasn't saved, or is missing the <code className="bg-black/50 px-1 rounded">export default function</code> line.
        </p>
      </div>
    );
  }

  // If it passes the safety nets, render the canvas normally!
  return <Component values={values} accent={simulator.accent} />;
}