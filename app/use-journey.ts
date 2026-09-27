'use client';

import { useEffect, type RefObject, type Dispatch, type SetStateAction } from 'react';

export function useJourney(
  story: RefObject<HTMLElement | null>,
  progress: RefObject<number>,
  mode: string,
  compact: boolean,
  setChapter: Dispatch<SetStateAction<number>>,
) {
  useEffect(() => {
    const element = story.current;
    if (!element || mode === 'choose' || compact) return;
    let frame = 0;
    // Continuous values stay outside React. Chapter content only updates when
    // its invisible document section crosses the observer's reading line.
    const update = () => {
      const distance = element.offsetHeight - innerHeight;
      progress.current = Math.min(1, Math.max(0, -element.getBoundingClientRect().top / Math.max(1, distance)));
      frame = requestAnimationFrame(update);
    };
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setChapter(Number((entry.target as HTMLElement).dataset.chapter));
      });
      }, { rootMargin: `0px 0px -${Math.max(0, innerHeight - 1)}px 0px`, threshold: 0 });
      element.querySelectorAll('[data-chapter]').forEach(node => observer.observe(node));
    };
    observe();
    window.addEventListener('resize', observe);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', observe); };
  }, [story, progress, mode, compact, setChapter]);
}
