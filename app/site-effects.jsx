'use client';
import { useEffect, useState } from 'react';
import GlowCursor from '../components/GlowCursor';

export default function SiteEffects() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let motion = true;
    const update = () => setEnabled(media.matches && motion);
    const onMotion = event => { motion = event.detail; update(); };
    update();
    media.addEventListener('change', update);
    window.addEventListener('enerlyze-motion', onMotion);
    return () => { media.removeEventListener('change', update); window.removeEventListener('enerlyze-motion', onMotion); };
  }, []);
  return enabled ? <div className="site-cursor" aria-hidden="true"><GlowCursor viewportMode color="#80BEFF" secondaryColor="#648EFF" trailLength={40} trailWidth={8} trailTaper={0.8} followSpeed={0.16} glowIntensity={1.9} glowSpread={1.2} hotspot={0.65} brightness={1.25} opacity={1} pulseSpeed={1.1} noiseStrength={0.035} idleFade idleTimeout={700} fadeDuration={900} blendMode="screen" /></div> : null;
}
