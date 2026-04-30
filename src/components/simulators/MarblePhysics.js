// MarblePhysics.js — 2D physics engine for marble rolling on curves

export class MarbleSimulation {
  constructor(curveFn, options = {}) {
    this.curveFn = curveFn;
    this.gravity = options.gravity || 500;        // pixels/s²
    this.friction = options.friction || 0.985;     // tangential velocity damping
    this.restitution = options.restitution || 0.4; // bounce coefficient
    this.marbleRadius = options.radius || 8;
    this.reset(options.startX || 0, options.startY || -5);
  }

  reset(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.trail = [];
    this.settled = false;
    this.settledTimer = 0;
    this.bounceCount = 0;
  }

  // Numerically compute the curve's derivative and normal
  _curveDerivative(x) {
    const eps = 0.001;
    const y1 = this.curveFn(x - eps);
    const y2 = this.curveFn(x + eps);
    if (!isFinite(y1) || !isFinite(y2)) return { slope: 0, nx: 0, ny: -1 };
    const slope = (y2 - y1) / (2 * eps);
    // Normal vector (pointing upward from curve surface)
    const len = Math.sqrt(1 + slope * slope);
    return {
      slope,
      nx: -slope / len,  // normal x
      ny: -1 / len,      // normal y (in math coords, up is positive)
    };
  }

  step(dt) {
    if (this.settled) return;

    // Apply gravity (in math coords: y-up, gravity pulls down)
    this.vy -= this.gravity * dt;

    // Move
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check if marble is below the curve surface
    const curveY = this.curveFn(this.x);
    if (isFinite(curveY) && this.y < curveY) {
      // Marble has penetrated the curve — resolve collision
      const { slope, nx, ny } = this._curveDerivative(this.x);

      // Project marble back to curve surface
      this.y = curveY;

      // Decompose velocity into normal and tangential components
      // Normal direction (in math coords): (-slope, -1)/len  → points "into" the surface from above
      // Actually we want the outward normal (away from surface, upward)
      const normalX = nx;
      const normalY = ny;

      // Velocity dot normal
      const vDotN = this.vx * normalX + this.vy * normalY;

      if (vDotN < 0) {
        // Marble is moving into the surface — reflect
        this.vx -= (1 + this.restitution) * vDotN * normalX;
        this.vy -= (1 + this.restitution) * vDotN * normalY;
        this.bounceCount++;
      }

      // Apply friction to tangential velocity
      const tanX = -normalY;
      const tanY = normalX;
      const vDotT = this.vx * tanX + this.vy * tanY;
      this.vx = tanX * vDotT * this.friction + normalX * (this.vx * normalX + this.vy * normalY);
      this.vy = tanY * vDotT * this.friction + normalY * (this.vx * normalX + this.vy * normalY);
    }

    // Track trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 300) this.trail.shift();

    // Check if settled (very low velocity for sustained time)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < 2) {
      this.settledTimer += dt;
      if (this.settledTimer > 1) this.settled = true;
    } else {
      this.settledTimer = 0;
    }
  }

  isInBucket(bucketX, bucketWidth) {
    return Math.abs(this.x - bucketX) < bucketWidth / 2;
  }

  getKineticEnergy() {
    return 0.5 * (this.vx * this.vx + this.vy * this.vy);
  }

  getPotentialEnergy(baseY) {
    return this.gravity * (this.y - baseY);
  }
}
