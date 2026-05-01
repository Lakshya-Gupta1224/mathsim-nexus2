// simulators.js — master config for all 30 simulators and quizzes

export const SIMULATORS = [
  // ─── ALGEBRA ───────────────────────────────────────────
  {
    id: "linear",
    title: "Linear Explorer",
    category: "Algebra",
    description: "Explore slope and intercept in y = mx + c.",
    icon: "📐",
    color: "from-cyan-500/20 to-blue-500/20",
    accent: "#22d3ee",
    sliders: [
      { key: "m", label: "Slope (m)", min: -5, max: 5, step: 0.1, default: 1 },
      {
        key: "c",
        label: "Intercept (c)",
        min: -10,
        max: 10,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "parabola",
    title: "Parabola Shifter",
    category: "Algebra",
    description: "Vertex form: y = a(x−h)² + k.",
    icon: "∪",
    color: "from-blue-500/20 to-indigo-500/20",
    accent: "#6366f1",
    sliders: [
      {
        key: "a",
        label: "Stretch (a)",
        min: -3,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "h",
        label: "Shift H (h)",
        min: -5,
        max: 5,
        step: 0.5,
        default: 0,
      },
      {
        key: "k",
        label: "Shift V (k)",
        min: -5,
        max: 5,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "polynomial",
    title: "Polynomial Wiggler",
    category: "Algebra",
    description: "Build (x−r₁)(x−r₂)(x−r₃)(x−r₄) from roots.",
    icon: "〜",
    color: "from-violet-500/20 to-purple-500/20",
    accent: "#8b5cf6",
    sliders: [
      { key: "r1", label: "Root r₁", min: -5, max: 5, step: 0.5, default: -3 },
      { key: "r2", label: "Root r₂", min: -5, max: 5, step: 0.5, default: -1 },
      { key: "r3", label: "Root r₃", min: -5, max: 5, step: 0.5, default: 1 },
      { key: "r4", label: "Root r₄", min: -5, max: 5, step: 0.5, default: 3 },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "logarithm",
    title: "Logarithmic Base",
    category: "Algebra",
    description: "See how y = logᵦ(x) changes with base b.",
    icon: "ln",
    color: "from-sky-500/20 to-cyan-500/20",
    accent: "#0ea5e9",
    sliders: [
      {
        key: "b",
        label: "Base (b)",
        min: 1.1,
        max: 20,
        step: 0.1,
        default: Math.E,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "systemsolver",
    title: "System Solver",
    category: "Algebra",
    description: "Find intersection of a₁x+b₁y=c₁ and a₂x+b₂y=c₂.",
    icon: "∩",
    color: "from-teal-500/20 to-emerald-500/20",
    accent: "#14b8a6",
    sliders: [
      {
        key: "a1",
        label: "Line 1 slope a₁",
        min: -5,
        max: 5,
        step: 0.5,
        default: 1,
      },
      {
        key: "b1",
        label: "Line 1 offset b₁",
        min: -5,
        max: 5,
        step: 0.5,
        default: 2,
      },
      {
        key: "a2",
        label: "Line 2 slope a₂",
        min: -5,
        max: 5,
        step: 0.5,
        default: -1,
      },
      {
        key: "b2",
        label: "Line 2 offset b₂",
        min: -5,
        max: 5,
        step: 0.5,
        default: -1,
      },
    ],
  },
  {
    id: "complexroots",
    title: "Roots of Unity",
    category: "Algebra",
    description: "Solutions to z^n = 1 on the complex plane.",
    icon: "ℂ",
    color: "from-fuchsia-500/20 to-purple-500/20",
    accent: "#d946ef",
    sliders: [
      { key: "n", label: "Degree n", min: 1, max: 12, step: 1, default: 3 },
    ],
  },

  // ─── TRIGONOMETRY ─────────────────────────────────────
  {
    id: "unitcircle",
    title: "Unit Circle",
    category: "Trigonometry",
    description: "Spin θ to see sin and cos projections live.",
    icon: "○",
    color: "from-amber-500/20 to-orange-500/20",
    accent: "#f59e0b",
    sliders: [
      {
        key: "theta",
        label: "Angle θ (deg)",
        min: 0,
        max: 360,
        step: 1,
        default: 45,
      },
    ],
  },
  {
    id: "wavemaker",
    title: "Wave Maker",
    category: "Trigonometry",
    description: "y = A·sin(ωx + φ) — control all three.",
    icon: "≋",
    color: "from-orange-500/20 to-red-500/20",
    accent: "#f97316",
    sliders: [
      {
        key: "A",
        label: "Amplitude (A)",
        min: 0.1,
        max: 5,
        step: 0.1,
        default: 1,
      },
      {
        key: "omega",
        label: "Frequency (ω)",
        min: 0.1,
        max: 5,
        step: 0.1,
        default: 1,
      },
      {
        key: "phi",
        label: "Phase (φ)",
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
        default: 0,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "fourier",
    title: "Fourier Series",
    category: "Trigonometry",
    description: "Add 3 harmonics to build a complex waveform.",
    icon: "Hz",
    color: "from-rose-500/20 to-pink-500/20",
    accent: "#e11d48",
    sliders: [
      {
        key: "h1",
        label: "Harmonic 1",
        min: 0,
        max: 2,
        step: 0.05,
        default: 1,
      },
      {
        key: "h2",
        label: "Harmonic 3",
        min: 0,
        max: 2,
        step: 0.05,
        default: 0.33,
      },
      {
        key: "h3",
        label: "Harmonic 5",
        min: 0,
        max: 2,
        step: 0.05,
        default: 0.2,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "triangle",
    title: "Triangle Flexer",
    category: "Trigonometry",
    description: "Law of cosines: solve for third side.",
    icon: "△",
    color: "from-pink-500/20 to-fuchsia-500/20",
    accent: "#ec4899",
    sliders: [
      { key: "a", label: "Side a", min: 1, max: 10, step: 0.5, default: 5 },
      { key: "b", label: "Side b", min: 1, max: 10, step: 0.5, default: 5 },
      {
        key: "C",
        label: "Angle C (deg)",
        min: 1,
        max: 179,
        step: 1,
        default: 60,
      },
    ],
  },
  {
    id: "tangentvis",
    title: "Tangent Visualizer",
    category: "Trigonometry",
    description: "See the geometric tangent length on the unit circle.",
    icon: "tan",
    color: "from-fuchsia-500/20 to-violet-500/20",
    accent: "#d946ef",
    sliders: [
      {
        key: "theta",
        label: "Angle θ (deg)",
        min: -85,
        max: 85,
        step: 1,
        default: 30,
      },
    ],
  },
  {
    id: "polarrose",
    title: "Polar Rose",
    category: "Trigonometry",
    description: "r = cos(kθ)",
    icon: "❀",
    color: "from-rose-500/20 to-pink-500/20",
    accent: "#f43f5e",
    sliders: [
      { key: "k", label: "k (Petals)", min: 1, max: 10, step: 1, default: 2 },
    ],
  },

  // ─── CALCULUS ─────────────────────────────────────────
  {
    id: "tangentslope",
    title: "Tangent Slope",
    category: "Calculus",
    description: "Slide x to see f'(x) = 2x on y = x².",
    icon: "f'",
    color: "from-lime-500/20 to-green-500/20",
    accent: "#84cc16",
    sliders: [
      { key: "x", label: "Point x", min: -4, max: 4, step: 0.1, default: 1 },
    ],
  },
  {
    id: "riemann",
    title: "Riemann Sums",
    category: "Calculus",
    description: "Increase rectangles n to approximate ∫sin(x)dx.",
    icon: "∑",
    color: "from-green-500/20 to-teal-500/20",
    accent: "#22c55e",
    sliders: [
      {
        key: "n",
        label: "Rectangles (n)",
        min: 1,
        max: 100,
        step: 1,
        default: 10,
      },
    ],
  },
  {
    id: "taylor",
    title: "Taylor Series",
    category: "Calculus",
    description: "Watch polynomial degree n converge to sin(x).",
    icon: "Tₙ",
    color: "from-emerald-500/20 to-cyan-500/20",
    accent: "#10b981",
    sliders: [
      { key: "n", label: "Degree (n)", min: 1, max: 15, step: 2, default: 3 },
    ],
  },
  {
    id: "limit",
    title: "Limit Visualizer",
    category: "Calculus",
    description: "Watch lim(h→0) [f(x+h)−f(x)]/h for f(x)=x².",
    icon: "lim",
    color: "from-cyan-500/20 to-sky-500/20",
    accent: "#06b6d4",
    sliders: [
      { key: "h", label: "Step h", min: 0.01, max: 3, step: 0.01, default: 1 },
      { key: "x0", label: "Point x₀", min: -3, max: 3, step: 0.5, default: 1 },
    ],
  },
  {
    id: "areaundercurve",
    title: "Area Under Curve",
    category: "Calculus",
    description: "Drag bounds a and b to compute ∫ₐᵇ x² dx.",
    icon: "∫",
    color: "from-sky-500/20 to-blue-500/20",
    accent: "#38bdf8",
    sliders: [
      {
        key: "a",
        label: "Lower bound (a)",
        min: -5,
        max: 4,
        step: 0.5,
        default: 0,
      },
      {
        key: "b",
        label: "Upper bound (b)",
        min: -4,
        max: 5,
        step: 0.5,
        default: 3,
      },
    ],
  },
  {
    id: "slopefield",
    title: "Slope Fields",
    category: "Calculus",
    description: "Differential equation dy/dx = cx - y",
    icon: "↗",
    color: "from-sky-500/20 to-blue-500/20",
    accent: "#0284c7",
    sliders: [
      { key: "c", label: "Constant c", min: -2, max: 2, step: 0.1, default: 1 },
    ],
  },

  // ─── LINEAR ALGEBRA & NUMBER THEORY ───────────────────
  {
    id: "matrix",
    title: "Matrix Warp",
    category: "Linear Algebra",
    description: "See how a 2x2 matrix transforms a coordinate grid.",
    icon: "▦",
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "#0ea5e9",
    sliders: [
      {
        key: "a",
        label: "Top Left [0,0]",
        min: -3,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "b",
        label: "Bottom Left [0,1]",
        min: -3,
        max: 3,
        step: 0.1,
        default: 0,
      },
      {
        key: "c",
        label: "Top Right [1,0]",
        min: -3,
        max: 3,
        step: 0.1,
        default: 0,
      },
      {
        key: "d",
        label: "Bottom Right [1,1]",
        min: -3,
        max: 3,
        step: 0.1,
        default: 1,
      },
    ],
  },
  {
    id: "modulocircle",
    title: "Modular Arithmetic",
    category: "Number Theory",
    description: "Multiplication times tables drawn on a circle.",
    icon: "⨂",
    color: "from-emerald-500/20 to-teal-500/20",
    accent: "#10b981",
    sliders: [
      {
        key: "n",
        label: "Points (Modulo)",
        min: 10,
        max: 200,
        step: 10,
        default: 100,
      },
      { key: "m", label: "Multiplier", min: 2, max: 100, step: 1, default: 2 },
    ],
  },

  // ─── GEOMETRY & ADVANCED ──────────────────────────────
  {
    id: "normaldist",
    title: "Normal Distribution",
    category: "Geometry & Advanced",
    description: "Shape the bell curve with μ and σ.",
    icon: "🔔",
    color: "from-blue-500/20 to-violet-500/20",
    accent: "#3b82f6",
    sliders: [
      { key: "mu", label: "Mean (μ)", min: -5, max: 5, step: 0.5, default: 0 },
      {
        key: "sigma",
        label: "Std Dev (σ)",
        min: 0.3,
        max: 5,
        step: 0.1,
        default: 1,
      },
    ],
  },
  {
    id: "vectoradder",
    title: "Vector Adder",
    category: "Geometry & Advanced",
    description: "Add two vectors by magnitude and angle.",
    icon: "⇀",
    color: "from-indigo-500/20 to-blue-500/20",
    accent: "#818cf8",
    sliders: [
      {
        key: "m1",
        label: "Vec 1 Magnitude",
        min: 0.5,
        max: 8,
        step: 0.5,
        default: 4,
      },
      {
        key: "a1",
        label: "Vec 1 Angle (deg)",
        min: 0,
        max: 360,
        step: 5,
        default: 45,
      },
      {
        key: "m2",
        label: "Vec 2 Magnitude",
        min: 0.5,
        max: 8,
        step: 0.5,
        default: 3,
      },
      {
        key: "a2",
        label: "Vec 2 Angle (deg)",
        min: 0,
        max: 360,
        step: 5,
        default: 135,
      },
    ],
  },
  {
    id: "polygon",
    title: "Polygon Generator",
    category: "Geometry & Advanced",
    description: "Slide n to build regular polygons and see angle sums.",
    icon: "⬡",
    color: "from-violet-500/20 to-purple-500/20",
    accent: "#a78bfa",
    sliders: [
      { key: "n", label: "Sides (n)", min: 3, max: 20, step: 1, default: 6 },
    ],
  },
  {
    id: "regression",
    title: "Linear Regression",
    category: "Geometry & Advanced",
    description: "Adjust data correlation and watch the best-fit line adapt.",
    icon: "r²",
    color: "from-purple-500/20 to-pink-500/20",
    accent: "#c084fc",
    sliders: [
      {
        key: "corr",
        label: "Correlation (r)",
        min: -1,
        max: 1,
        step: 0.05,
        default: 0.8,
      },
      {
        key: "noise",
        label: "Noise level",
        min: 0,
        max: 2,
        step: 0.1,
        default: 0.5,
      },
    ],
  },
  {
    id: "lorenz",
    title: "Lorenz Attractor",
    category: "Chaos",
    description: "Tweak σ, ρ, β to reveal chaotic beauty.",
    icon: "∞",
    color: "from-red-500/20 to-orange-500/20",
    accent: "#ef4444",
    sliders: [
      {
        key: "sigma",
        label: "Sigma (σ)",
        min: 1,
        max: 20,
        step: 0.5,
        default: 10,
      },
      { key: "rho", label: "Rho (ρ)", min: 1, max: 50, step: 0.5, default: 28 },
      {
        key: "beta",
        label: "Beta (β)",
        min: 0.5,
        max: 5,
        step: 0.1,
        default: 2.667,
      },
    ],
  },
  {
    id: "lissajous",
    title: "Lissajous Curves",
    category: "Geometry & Advanced",
    description: "Parametric equations x=sin(at+δ), y=sin(bt)",
    icon: "➰",
    color: "from-purple-500/20 to-indigo-500/20",
    accent: "#8b5cf6",
    sliders: [
      { key: "a", label: "Freq a", min: 1, max: 10, step: 1, default: 3 },
      { key: "b", label: "Freq b", min: 1, max: 10, step: 1, default: 2 },
      {
        key: "delta",
        label: "Phase δ",
        min: 0,
        max: 3.14,
        step: 0.1,
        default: 1.5,
      },
    ],
  },
  {
    id: "bezier",
    title: "Bezier Curve",
    category: "Geometry & Advanced",
    description: "Quadratic control point manipulation.",
    icon: "〰",
    color: "from-amber-500/20 to-orange-500/20",
    accent: "#f59e0b",
    sliders: [
      { key: "cx", label: "Control X", min: -5, max: 5, step: 0.5, default: 0 },
      {
        key: "cy",
        label: "Control Y",
        min: -5,
        max: 5,
        step: 0.5,
        default: -3,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "conic",
    title: "Conic Sections",
    category: "Geometry & Advanced",
    description: "Shape evolution based on eccentricity (e).",
    icon: "◖",
    color: "from-lime-500/20 to-green-500/20",
    accent: "#84cc16",
    sliders: [
      {
        key: "e",
        label: "Eccentricity e",
        min: 0,
        max: 2,
        step: 0.1,
        default: 0.5,
      },
      {
        key: "shiftX",
        label: "Shift X",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
      {
        key: "shiftY",
        label: "Shift Y",
        min: -50,
        max: 50,
        step: 0.5,
        default: 0,
      },
    ],
  },
  {
    id: "epicycle",
    title: "Epicycles",
    category: "Geometry & Advanced",
    description: "Circles rolling on circles.",
    icon: "◎",
    color: "from-violet-500/20 to-fuchsia-500/20",
    accent: "#a855f7",
    sliders: [
      { key: "f1", label: "Frequency 1", min: -5, max: 5, step: 1, default: 1 },
      { key: "f2", label: "Frequency 2", min: -5, max: 5, step: 1, default: 3 },
    ],
  },
  {
    id: "cobweb",
    title: "Logistic Map",
    category: "Chaos",
    description: "Cobweb plot for x = rx(1-x).",
    icon: "🕸",
    color: "from-red-500/20 to-rose-500/20",
    accent: "#e11d48",
    sliders: [
      {
        key: "r",
        label: "Growth Rate r",
        min: 1,
        max: 4,
        step: 0.01,
        default: 2.8,
      },
      {
        key: "x0",
        label: "Initial x₀",
        min: 0.01,
        max: 0.99,
        step: 0.01,
        default: 0.2,
      },
    ],
  },

  // ─── 3D WEBGL SIMULATORS ─────────────────────────────
  {
    id: "topography",
    title: "Interactive Topography",
    category: "3D Visualizers",
    is3D: true,
    description:
      "Explore f(x,y) as a 3D surface. Drag to orbit, scroll to zoom.",
    icon: "🏔️",
    color: "from-emerald-500/20 to-teal-500/20",
    accent: "#10b981",
    sliders: [
      { key: "a", label: "Amplitude", min: 0.5, max: 3, step: 0.1, default: 1 },
      {
        key: "b",
        label: "X Frequency",
        min: 0.5,
        max: 5,
        step: 0.1,
        default: 1,
      },
      {
        key: "c",
        label: "Y Frequency",
        min: 0.5,
        max: 5,
        step: 0.1,
        default: 1,
      },
    ],
  },
  {
    id: "lorenz3d",
    title: "3D Lorenz Attractor",
    category: "3D Visualizers",
    is3D: true,
    description:
      "Full 3D chaotic attractor with time scrubbing. Orbit and zoom the butterfly.",
    icon: "🦋",
    color: "from-rose-500/20 to-red-500/20",
    accent: "#f43f5e",
    sliders: [
      {
        key: "sigma",
        label: "Sigma (σ)",
        min: 1,
        max: 20,
        step: 0.5,
        default: 10,
      },
      { key: "rho", label: "Rho (ρ)", min: 1, max: 50, step: 0.5, default: 28 },
      {
        key: "beta",
        label: "Beta (β)",
        min: 0.5,
        max: 5,
        step: 0.1,
        default: 2.667,
      },
    ],
  },
  {
    id: "gradientdescent3d",
    title: "3D Gradient Descent",
    category: "3D Visualizers",
    is3D: true,
    description:
      "Watch an agent find the minimum of a 3D cost surface using gradient descent.",
    icon: "∇",
    color: "from-purple-500/20 to-fuchsia-500/20",
    accent: "#d946ef",
    sliders: [
      {
        key: "alpha",
        label: "Learning Rate (α)",
        min: 0.001,
        max: 0.5,
        step: 0.001,
        default: 0.05,
      },
      {
        key: "costFn",
        label: "Cost Function",
        min: 1,
        max: 3,
        step: 1,
        default: 1,
      },
      {
        key: "startX",
        label: "Start X",
        min: -4,
        max: 4,
        step: 0.1,
        default: 3,
      },
      {
        key: "startY",
        label: "Start Y",
        min: -4,
        max: 4,
        step: 0.1,
        default: 3,
      },
    ],
  },
];

export const SIMULATOR_META = {
  // Original 20
  linear: {
    theory:
      "Linear function: y = mx + c. m is slope (rise/run), c is y-intercept.",
    intuition: "Increase m to steepen. Increase c to shift up.",
    examQuestion: "If y = 2x + 3, what is the y-intercept?",
    options: ["2", "3", "5", "-3"],
    answer: "3",
  },
  parabola: {
    theory: "Vertex form: y = a(x−h)² + k. Vertex at (h, k). a controls width.",
    intuition:
      "a > 0 opens up, a < 0 opens down. h shifts left/right, k shifts up/down.",
    examQuestion: "What is the vertex of y = 2(x−1)² + 3?",
    options: ["(1, 3)", "(-1, 3)", "(1, -3)", "(2, 3)"],
    answer: "(1, 3)",
  },
  polynomial: {
    theory:
      "Polynomial with roots r₁, r₂, r₃, r₄: f(x) = (x−r₁)(x−r₂)(x−r₃)(x−r₄).",
    intuition:
      "Roots are x-intercepts. Adjust roots to shift where curve crosses x-axis.",
    examQuestion: "What are the roots of (x+2)(x−1)(x−3)?",
    options: ["-2, 1, 3", "-2, -1, 3", "2, 1, 3", "1, 3, 5"],
    answer: "-2, 1, 3",
  },
  logarithm: {
    theory:
      "Logarithm: y = logᵦ(x) is inverse of y = bˣ. Base b determines growth rate.",
    intuition: "Base > 1: slower growth. Base near 1: steeper rise initially.",
    examQuestion: "log₂(8) = ?",
    options: ["2", "3", "4", "8"],
    answer: "3",
  },
  systemsolver: {
    theory: "System of 2 lines: find (x, y) where both equations are true.",
    intuition: "Adjust slopes to make lines intersect at different points.",
    examQuestion: "Solve: x + y = 5, x − y = 1",
    options: ["(3, 2)", "(2, 3)", "(4, 1)", "(1, 4)"],
    answer: "(3, 2)",
  },
  unitcircle: {
    theory:
      "Unit circle: radius = 1. sin(θ) = y, cos(θ) = x. sin²θ + cos²θ = 1.",
    intuition: "Rotate θ to trace projections on axes. See periodic behavior.",
    examQuestion: "sin(90°) = ?",
    options: ["0", "0.5", "1", "-1"],
    answer: "1",
  },
  wavemaker: {
    theory:
      "Sinusoidal: y = A·sin(ωx + φ). A = amplitude, ω = frequency, φ = phase shift.",
    intuition:
      "A stretches vertically, ω compresses horizontally, φ shifts left/right.",
    examQuestion: "What is the amplitude of y = 3·sin(x)?",
    options: ["1", "2", "3", "x"],
    answer: "3",
  },
  fourier: {
    theory:
      "Fourier series: sum of sine waves at different frequencies build complex shapes.",
    intuition:
      "Each harmonic adds detail. More harmonics = closer to target shape.",
    examQuestion: "What does the first harmonic represent?",
    options: ["Fundamental frequency", "Sum of all", "Noise", "Phase shift"],
    answer: "Fundamental frequency",
  },
  triangle: {
    theory:
      "Law of cosines: c² = a² + b² − 2ab·cos(C). Finds third side given two sides and angle.",
    intuition: "Adjust sides or angle to see how triangle changes shape.",
    examQuestion: "In triangle, a=3, b=4, C=90°. Find c.",
    options: ["5", "7", "12", "25"],
    answer: "5",
  },
  tangentvis: {
    theory:
      "Tangent of angle θ on unit circle: tan(θ) = sin(θ)/cos(θ). Geometric length of tangent line.",
    intuition: "As θ → 90°, tan(θ) → ∞. Undefined at ±90°.",
    examQuestion: "tan(45°) = ?",
    options: ["0", "0.5", "1", "√2"],
    answer: "1",
  },
  tangentslope: {
    theory:
      "Derivative: f'(x) = lim(h→0) [f(x+h)−f(x)]/h. For f(x)=x², f'(x)=2x.",
    intuition: "Slope of tangent line at x. Steeper as x increases (for x²).",
    examQuestion: "What is f'(2) if f(x) = x²?",
    options: ["2", "3", "4", "8"],
    answer: "4",
  },
  riemann: {
    theory:
      "Riemann sum: approximate ∫f(x)dx by summing rectangle areas under curve.",
    intuition: "More rectangles (n) = better approximation to true integral.",
    examQuestion: "More rectangles in Riemann sum gives _____ accuracy.",
    options: ["Lower", "Higher", "Same", "No change"],
    answer: "Higher",
  },
  taylor: {
    theory:
      "Taylor polynomial of degree n: polynomial approximation of f(x) near x=0.",
    intuition: "Higher degree = better fit. Degree ∞ = exact function.",
    examQuestion: "What is the first term in Taylor series of sin(x)?",
    options: ["x", "x²", "1", "x³"],
    answer: "x",
  },
  limit: {
    theory: "Derivative as limit: f'(x) = lim(h→0) [f(x+h)−f(x)]/h.",
    intuition:
      "Decrease h to see limit converge. h=0 undefined, but h→0 is defined.",
    examQuestion: "lim(x→2) (x²) = ?",
    options: ["2", "4", "6", "undefined"],
    answer: "4",
  },
  areaundercurve: {
    theory: "Definite integral: ∫ₐᵇ f(x)dx = area under curve from x=a to x=b.",
    intuition:
      "Adjust bounds a, b to see area change. Negative area below x-axis.",
    examQuestion: "Area under f(x)=x from x=0 to x=2?",
    options: ["1", "2", "4", "8"],
    answer: "2",
  },
  normaldist: {
    theory:
      "Normal distribution N(μ, σ²): bell curve. μ = mean, σ = std dev. ~68% within μ±σ.",
    intuition:
      "μ shifts center, σ controls spread. Larger σ = wider, flatter curve.",
    examQuestion: "In N(0,1), what % of data is within μ±σ?",
    options: ["50%", "68%", "95%", "99%"],
    answer: "68%",
  },
  vectoradder: {
    theory:
      "Vector sum: add two vectors by components. Resultant = √[(x₁+x₂)² + (y₁+y₂)²].",
    intuition:
      "Adjust magnitudes and angles. Parallel vectors add fully, opposite cancel.",
    examQuestion: "Two perpendicular vectors, |V₁|=3, |V₂|=4. |V₁+V₂|=?",
    options: ["5", "7", "12", "1"],
    answer: "5",
  },
  polygon: {
    theory:
      "Regular polygon: n sides, internal angle = (n−2)×180°/n. Sum of angles = (n−2)×180°.",
    intuition:
      "Increase n towards circle. Each side gets shorter, angles increase.",
    examQuestion: "Interior angle of regular hexagon (n=6)?",
    options: ["90°", "120°", "108°", "135°"],
    answer: "120°",
  },
  regression: {
    theory:
      "Linear regression: find best-fit line y = mx + c minimizing error. R² = correlation strength.",
    intuition:
      "Higher correlation = tighter fit. R²=1 perfect, R²=0 no relationship.",
    examQuestion: "R² = 0.95 means _____ % of variance explained.",
    options: ["50", "95", "90", "100"],
    answer: "95",
  },
  lorenz: {
    theory:
      "Lorenz attractor: chaotic 3D system dx/dt=σ(y−x), dy/dt=x(ρ−z)−y, dz/dt=xy−βz.",
    intuition:
      "Small σ/ρ/β changes cause large trajectory shifts. Sensitive dependence.",
    examQuestion: "Lorenz system demonstrates _____.",
    options: ["Linearity", "Chaos", "Stability", "Decay"],
    answer: "Chaos",
  },

  // New 10 Advanced
  matrix: {
    theory: "Matrix transformations alter geometric space.",
    intuition:
      "Watch the grid stretch, rotate, and skew based on the 2x2 matrix values.",
    examQuestion:
      "Which matrix represents the identity transformation (no change)?",
    options: ["[1,0 ; 0,1]", "[0,1 ; 1,0]", "[0,0 ; 0,0]", "[-1,0 ; 0,-1]"],
    answer: "[1,0 ; 0,1]",
  },
  polarrose: {
    theory: "Polar graph of r = cos(kθ)",
    intuition: "The value of k determines the number of petals on the curve.",
    examQuestion:
      "For r = cos(kθ), if k is an odd integer, how many petals does the rose have?",
    options: ["k", "2k", "k/2", "k+1"],
    answer: "k",
  },
  lissajous: {
    theory: "Parametric curves formed by orthogonal sine waves.",
    intuition: "The ratio of frequencies creates distinct looping patterns.",
    examQuestion:
      "If frequencies a and b are equal (a=b) and phase δ is π/2, what shape is the Lissajous curve?",
    options: ["Circle", "Line", "Figure-8", "Parabola"],
    answer: "Circle",
  },
  modulocircle: {
    theory: "Modular arithmetic mapped geometrically onto a circle.",
    intuition:
      "Multiplication patterns create beautiful cardioids and envelopes.",
    examQuestion:
      "In modular arithmetic, if the modulo (n) is 10, what is 7 × 3 (mod 10)?",
    options: ["1", "7", "21", "0"],
    answer: "1",
  },
  bezier: {
    theory: "Quadratic curves controlled by start, end, and middle points.",
    intuition: "The curve is mathematically pulled towards the control point.",
    examQuestion:
      "How many total points define a standard quadratic Bezier curve?",
    options: ["3", "2", "4", "1"],
    answer: "3",
  },
  slopefield: {
    theory: "Visual representation of a differential equation dy/dx.",
    intuition: 'The arrows show the "flow" or path of possible solutions.',
    examQuestion:
      "In a slope field for dy/dx = y, what is the slope at any point on the x-axis (where y=0)?",
    options: ["0", "1", "Undefined", "Infinity"],
    answer: "0",
  },
  complexroots: {
    theory: "Solutions to the equation z^n = 1 in the complex plane.",
    intuition:
      "The roots are perfectly spaced out along the edge of the unit circle.",
    examQuestion: "How many distinct roots of unity exist for z^n = 1?",
    options: ["n", "n-1", "n+1", "Infinite"],
    answer: "n",
  },
  cobweb: {
    theory: "Iterating a function to find fixed points or chaotic behavior.",
    intuition:
      "Watch the path bounce between the line y=x and the function curve y=f(x).",
    examQuestion:
      "What value of x makes the logistic map x = rx(1-x) equal to zero?",
    options: ["0 or 1", "0.5", "r", "-1"],
    answer: "0 or 1",
  },
  conic: {
    theory: "Curves defined by a focus point and a directrix line.",
    intuition: "e<1 is an ellipse, e=1 a parabola, and e>1 a hyperbola.",
    examQuestion: "Which eccentricity (e) defines a perfect circle?",
    options: ["e = 0", "e = 1", "e > 1", "0 < e < 1"],
    answer: "e = 0",
  },
  epicycle: {
    theory: "The geometric path of a circle rolling on another circle.",
    intuition:
      "Adding different frequencies together creates complex, spirograph-like paths.",
    examQuestion:
      "In an epicycle system, adding a smaller, high-frequency circle makes the drawn shape:",
    options: [
      "More complex/loopy",
      "A perfect circle",
      "A straight line",
      "Disappear",
    ],
    answer: "More complex/loopy",
  },

  // 3D Visualizers
  topography: {
    theory:
      "Multivariable functions f(x,y) create surfaces in 3D. The height at each (x,y) point represents z = f(x,y).",
    intuition:
      "Changing frequency parameters creates mountain-like peaks and valleys. Higher amplitude = taller peaks.",
    examQuestion: "For f(x,y) = sin(x)·cos(y), what is f(0,0)?",
    options: ["0", "1", "-1", "undefined"],
    answer: "0",
  },
  lorenz3d: {
    theory:
      "The Lorenz system in full 3D: dx/dt=σ(y−x), dy/dt=x(ρ−z)−y, dz/dt=xy−βz. The attractor has a butterfly shape.",
    intuition:
      "The 3D view reveals the true butterfly structure hidden in 2D projections. Orbiting shows both wings.",
    examQuestion: "The Lorenz attractor is an example of a _____ attractor.",
    options: ["Strange", "Fixed point", "Periodic", "Linear"],
    answer: "Strange",
  },
  gradientdescent3d: {
    theory:
      "Gradient Descent updates positions iteratively: x = x - α * df/dx. α is the learning rate.",
    intuition:
      "A high learning rate can overshoot the minimum, while a low one is too slow. Non-convex functions have local minima where it can get stuck.",
    examQuestion: "What does the gradient of a cost function indicate?",
    options: [
      "Direction of steepest ascent",
      "The minimum value",
      "Learning rate",
      "Number of steps",
    ],
    answer: "Direction of steepest ascent",
  },
};

export const CATEGORIES = [...new Set(SIMULATORS.map((s) => s.category))];

// Curve function factories for Marble Run mode
// Each returns (values) => (x) => y, producing a curve function from slider values
export const CURVE_FN_FACTORIES = {
  linear: (v) => (x) => v.m * (x - (v.shiftX || 0)) + v.c + (v.shiftY || 0),
  parabola: (v) => (x) =>
    v.a * (x - v.h - (v.shiftX || 0)) ** 2 + v.k + (v.shiftY || 0),
  polynomial: (v) => (x) =>
    ((x - (v.shiftX || 0) - v.r1) *
      (x - (v.shiftX || 0) - v.r2) *
      (x - (v.shiftX || 0) - v.r3) *
      (x - (v.shiftX || 0) - v.r4)) /
      10 +
    (v.shiftY || 0),
  logarithm: (v) => (x) =>
    x - (v.shiftX || 0) > 0.05
      ? Math.log(x - (v.shiftX || 0)) / Math.log(v.b) + (v.shiftY || 0)
      : -10,
  wavemaker: (v) => (x) =>
    v.A * Math.sin(v.omega * (x - (v.shiftX || 0)) + v.phi) + (v.shiftY || 0),
  fourier: (v) => (x) =>
    v.h1 * Math.sin(x - (v.shiftX || 0)) +
    v.h2 * Math.sin(3 * (x - (v.shiftX || 0))) +
    v.h3 * Math.sin(5 * (x - (v.shiftX || 0))) +
    (v.shiftY || 0),
  bezier: (v) => (x) => {
    // Approximate quadratic bezier as function of x
    const sx = x - (v.shiftX || 0);
    const t = (sx + 2) / 4; // map x from [-2,2] to t in [0,1]
    if (t < 0 || t > 1) return -10;
    const p0y = -1,
      p1y = v.cy,
      p2y = 1;
    return (
      (1 - t) * (1 - t) * p0y +
      2 * (1 - t) * t * p1y +
      t * t * p2y +
      (v.shiftY || 0)
    );
  },
  conic: (v) => (x) => {
    // Approximate conic section as y = f(x)
    const e = v.e;
    const a = e * 5;
    const sx = x - (v.shiftX || 0);
    if (e < 1) {
      // ellipse
      const b = a * Math.sqrt(1 - e * e);
      const val = 1 - (sx * sx) / (a * a);
      return val > 0 ? b * Math.sqrt(val) + (v.shiftY || 0) : v.shiftY || 0;
    }
    return a / (1 + Math.abs(sx)) + (v.shiftY || 0); // fallback
  },
};

// IDs of simulators compatible with marble mode
export const MARBLE_SIMS = new Set(Object.keys(CURVE_FN_FACTORIES));

// IDs of simulators compatible with boat/vector-field navigation
export const BOAT_SIMS = new Set(["slopefield", "matrix", "vectoradder"]);
