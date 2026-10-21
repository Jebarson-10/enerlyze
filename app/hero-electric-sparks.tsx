'use client';

import {useEffect, useRef} from 'react';

type Spark = {
  born: number;
  life: number;
  color: string;
  points: [number, number][];
};

const colors = ['#385cff', '#00b8ae', '#f3bd28', '#ec5277', '#9468f2'];

export default function HeroElectricSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let nextSpark = 0;
    const sparks: Spark[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeSpark = (now: number) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.min(width, height);
      const base = radius * (0.37 + Math.random() * 0.025);
      const length = radius * (0.08 + Math.random() * 0.12);
      const steps = 3 + Math.floor(Math.random() * 3);
      const points: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const r = base + length * t;
        const deviation = i === 0 ? 0 : (Math.random() - 0.5) * radius * 0.038 * t;
        points.push([
          width / 2 + Math.cos(angle) * r - Math.sin(angle) * deviation,
          height / 2 + Math.sin(angle) * r + Math.cos(angle) * deviation,
        ]);
      }
      sparks.push({born: now, life: 220 + Math.random() * 300, color: colors[Math.floor(Math.random() * colors.length)], points});
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      if (now >= nextSpark && sparks.length < 9) {
        makeSpark(now);
        if (Math.random() > 0.6) makeSpark(now);
        nextSpark = now + 90 + Math.random() * 170;
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        const age = (now - spark.born) / spark.life;
        if (age >= 1) {sparks.splice(i, 1); continue;}
        const opacity = Math.sin(Math.PI * Math.min(1, age * 1.8)) * (1 - age);
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        spark.points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = opacity * 0.8;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.65;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; if (!visible) ctx.clearRect(0, 0, width, height);});
    visibilityObserver.observe(canvas);
    resize();
    frame = requestAnimationFrame(draw);
    return () => {cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect();};
  }, []);

  return <canvas className="hero-electric-sparks" ref={canvasRef} aria-hidden="true" />;
}
