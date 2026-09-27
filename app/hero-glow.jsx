'use client';

import { useEffect, useState } from 'react';
import GlowCursor from '../components/GlowCursor';

export default function HeroGlow({ motion, children }) {
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setCanAnimate(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="hero-glow-stage">
      {motion && canAnimate ? (
          <GlowCursor
            color="#67E8F9"
            secondaryColor="#A78BFA"
            trailLength={40}
            trailWidth={8}
            trailTaper={0.8}
            followSpeed={0.16}
            glowIntensity={1.9}
            glowSpread={1.2}
            hotspot={0.65}
            brightness={1.25}
            opacity={1}
            pulseSpeed={1.1}
            noiseStrength={0.035}
            idleFade
            idleTimeout={700}
            fadeDuration={900}
            blendMode="screen"
          >
            {children}
          </GlowCursor>
      ) : children}
    </div>
  );
}
