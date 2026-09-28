'use client';
import {useEffect,useState} from 'react';
import PointLogo from './point-logo';

export default function SiteHeader({active}:{active:'calculator'|'shop'}) {
  const [motion,setMotion]=useState(true);
  useEffect(()=>setMotion(!matchMedia('(prefers-reduced-motion: reduce)').matches),[]);
  return <header className="topbar product-topbar"><a className="wordmark" href="/" aria-label="Enerlyze home"><PointLogo motion={motion}/>enerlyze</a><nav className="product-navigation" aria-label="Main navigation"><a href="/#home">Home</a><a href="/#business">Business</a><a href="/calculator" aria-current={active==='calculator'?'page':undefined}>Energy calculator</a><a href="/shop" aria-current={active==='shop'?'page':undefined}>Shop</a></nav><button className="motion-toggle" onClick={()=>{const next=!motion;setMotion(next);window.dispatchEvent(new CustomEvent('enerlyze-motion',{detail:next}));}} aria-pressed={motion}>Motion {motion?'on':'off'}</button></header>;
}
