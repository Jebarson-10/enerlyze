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
  return enabled ? <div className="site-cursor" aria-hidden="true"><GlowCursor viewportMode instantHotspot maxDevicePixelRatio={1} color="#9dcaff" secondaryColor="#82ddcf" trailLength={18} trailSegmentLength={5.8} trailWidth={4.5} trailTaper={0.9} followSpeed={1} glowIntensity={1.2} glowSpread={0.7} hotspot={0.78} brightness={1.2} opacity={0.85} pulseSpeed={0} noiseStrength={0} idleFade idleTimeout={400} fadeDuration={240} blendMode="screen" /></div> : null;
}
