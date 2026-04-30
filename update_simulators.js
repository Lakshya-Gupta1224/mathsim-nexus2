const fs = require('fs');
let code = fs.readFileSync('src/simulators.js', 'utf8');

const targets = ['linear', 'parabola', 'polynomial', 'logarithm', 'wavemaker', 'fourier', 'bezier', 'conic'];
const shiftSliders = ", { key: 'shiftX', label: 'Shift X', min: -50, max: 50, step: 0.5, default: 0 }, { key: 'shiftY', label: 'Shift Y', min: -50, max: 50, step: 0.5, default: 0 }";

targets.forEach(id => {
  const regex = new RegExp("({ id: '" + id + "', [\\s\\S]*?sliders: \\[[^\\]]*?)(\\] })");
  code = code.replace(regex, (match, p1, p2) => p1 + shiftSliders + p2);
});

// Update CURVE_FN_FACTORIES
code = code.replace('linear:     (v) => (x) => v.m * x + v.c,', 'linear:     (v) => (x) => v.m * (x - (v.shiftX||0)) + v.c + (v.shiftY||0),');
code = code.replace('parabola:   (v) => (x) => v.a * (x - v.h) ** 2 + v.k,', 'parabola:   (v) => (x) => v.a * (x - v.h - (v.shiftX||0)) ** 2 + v.k + (v.shiftY||0),');
code = code.replace('polynomial: (v) => (x) => (x - v.r1) * (x - v.r2) * (x - v.r3) * (x - v.r4) / 10,', 'polynomial: (v) => (x) => (x - (v.shiftX||0) - v.r1) * (x - (v.shiftX||0) - v.r2) * (x - (v.shiftX||0) - v.r3) * (x - (v.shiftX||0) - v.r4) / 10 + (v.shiftY||0),');
code = code.replace('logarithm:  (v) => (x) => x > 0.05 ? Math.log(x) / Math.log(v.b) : -10,', 'logarithm:  (v) => (x) => (x - (v.shiftX||0)) > 0.05 ? Math.log(x - (v.shiftX||0)) / Math.log(v.b) + (v.shiftY||0) : -10,');
code = code.replace('wavemaker:  (v) => (x) => v.A * Math.sin(v.omega * x + v.phi),', 'wavemaker:  (v) => (x) => v.A * Math.sin(v.omega * (x - (v.shiftX||0)) + v.phi) + (v.shiftY||0),');
code = code.replace('fourier:    (v) => (x) => v.h1 * Math.sin(x) + v.h2 * Math.sin(3 * x) + v.h3 * Math.sin(5 * x),', 'fourier:    (v) => (x) => v.h1 * Math.sin(x - (v.shiftX||0)) + v.h2 * Math.sin(3 * (x - (v.shiftX||0))) + v.h3 * Math.sin(5 * (x - (v.shiftX||0))) + (v.shiftY||0),');
code = code.replace('const t = (x + 2) / 4;', 'const sx = x - (v.shiftX||0);\n    const t = (sx + 2) / 4;');
code = code.replace('return (1-t)*(1-t)*p0y + 2*(1-t)*t*p1y + t*t*p2y;', 'return (1-t)*(1-t)*p0y + 2*(1-t)*t*p1y + t*t*p2y + (v.shiftY||0);');
code = code.replace('const val = 1 - (x * x) / (a * a);', 'const sx = x - (v.shiftX||0);\n      const val = 1 - (sx * sx) / (a * a);');
code = code.replace('return val > 0 ? b * Math.sqrt(val) : 0;', 'return val > 0 ? b * Math.sqrt(val) + (v.shiftY||0) : 0 + (v.shiftY||0);');
code = code.replace('return a / (1 + Math.abs(x));', 'return a / (1 + Math.abs(sx)) + (v.shiftY||0);');

fs.writeFileSync('src/simulators.js', code);
console.log('simulators.js updated');
