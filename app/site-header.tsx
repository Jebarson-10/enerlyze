'use client';
import PointLogo from './point-logo';
export default function SiteHeader({active}:{active:'calculator'|'shop'}) {
 return <header className="topbar product-topbar"><a className="wordmark" href="/" aria-label="Enerlyze home"><PointLogo motion/>enerlyze</a><nav className="product-navigation" aria-label="Main navigation"><a href="/#home">Home</a><a href="/#business">Business</a><a href="/calculator" aria-current={active==='calculator'?'page':undefined}>Enerlyzer</a><a href="/shop" aria-current={active==='shop'?'page':undefined}>Shop</a></nav></header>;
}
