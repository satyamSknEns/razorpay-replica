import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";

// components/LinkedParticles.ts
export function randomInRange(min: number, max: number) {
  return min + (max - min) * Math.random();
}

export default class LinkedParticles {
  private ctx: CanvasRenderingContext2D;
  points: Array<any> = [];
  // … copy over all your settings as public fields …
  force_point_enabled = false;
  currentCursorPosition = { x: 0, y: 0 };
  transparent_background = false;
  background_color = '#140328';
  points_count = 150;
  point_color = '#791787';
  point_size = 1.5;
  velocity_ratio = 1;
  velocity_decay = 0.8;
  gravity = 0;
  bounce = 1;
  line_width = 0.2;
  line_distance = 45;
  lines_color = '#595959';
  lines_gradient_enabled = false;
  lines_gradient_start_color = '#ffa700';
  lines_gradient_middle_color = '#f00f0f';
  lines_gradient_end_color = '#ff00ff';

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.lineCap = 'round';
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.ctx.canvas.addEventListener('mousemove', this.onMouseMove);
    this.init();
  }

  init() {
    this.points = [];
    for (let i = 0; i < this.points_count; i++) {
      this.points.push({
        mass: 50,
        x: randomInRange(5, this.ctx.canvas.width - 5),
        y: randomInRange(5, this.ctx.canvas.height - 5),
        vx: randomInRange(-1, 1),
        vy: randomInRange(-1, 1),
        ax: 0,
        ay: 0,
      });
    }
  }

  onResize = () => {
    const c = this.ctx.canvas;
    c.width = window.innerWidth *  (window.devicePixelRatio || 1);
    c.height = window.innerHeight * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  };

  onMouseMove = (e: MouseEvent) => {
    this.currentCursorPosition.x = e.clientX;
    this.currentCursorPosition.y = e.clientY;
  };

  update() {
    // … copy your update logic here …
    if (this.force_point_enabled) {
      for (const pt of this.points) {
        const dx = this.currentCursorPosition.x - pt.x;
        const dy = this.currentCursorPosition.y - pt.y;
        const d  = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        if (d < 100) {
          pt.ax = 0.5 * d * Math.cos(ang);
          pt.ay = 0.5 * d * Math.sin(ang);
        }
      }
    }

    for (const pt of this.points) {
      pt.ax *= 0.1;
      pt.vx += pt.ax * this.velocity_ratio * this.velocity_decay;
      pt.x += pt.vx;
      pt.ay *= 0.1;
      pt.vy += (pt.ay + this.gravity) * this.velocity_ratio * this.velocity_decay;
      pt.y += pt.vy;

      // bounce on edges
      const s = this.point_size;
      if (pt.x > window.innerWidth - s) {
        pt.x = window.innerWidth - s;
        pt.vx *= -this.bounce;
      }
      if (pt.x < s) {
        pt.x = s;
        pt.vx *= -this.bounce;
      }
      if (pt.y > window.innerHeight - s) {
        pt.y = window.innerHeight - s;
        pt.vy *= -this.bounce;
      }
      if (pt.y < s) {
        pt.y = s;
        pt.vy *= -this.bounce;
      }
    }
  }

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (!this.transparent_background) {
      ctx.fillStyle = this.background_color;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    ctx.lineWidth = this.line_width;
    // draw lines
    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i];
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j];
        if (
          Math.abs(p1.x - p2.x) <= this.line_distance &&
          Math.abs(p1.y - p2.y) <= this.line_distance
        ) {
          ctx.strokeStyle = this.lines_color;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // draw points
    for (const pt of this.points) {
      ctx.fillStyle = this.point_color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.point_size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.ctx.canvas.removeEventListener('mousemove', this.onMouseMove);
  }
}
