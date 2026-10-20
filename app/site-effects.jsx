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
  return enabled ? <div className="site-cursor" aria-hidden="true"><GlowCursor viewportMode instantHotspot maxDevicePixelRatio={1} color="#80BEFF" secondaryColor="#648EFF" trailLength={40} trailWidth={7} trailTaper={0.8} followSpeed={1} glowIntensity={1.7} glowSpread={1.1} hotspot={0.75} brightness={1.3} opacity={1} pulseSpeed={1.1} noiseStrength={0.025} idleFade idleTimeout={700} fadeDuration={900} blendMode="screen" /></div> : null;
}
