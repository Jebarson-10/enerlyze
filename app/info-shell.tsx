import SiteHeader from './site-header';
import Link from 'next/link';
export default function InfoShell({children,active}:{children:React.ReactNode;active?:'about'|'guides'|'methodology'|'enerlyzer'}){
  return <div className="site info-site"><SiteHeader active={active}/><main className="info-main">{children}</main><footer className="tool-footer info-footer"><Link href="/">Enerlyze</Link><Link href="/calculator">Open Enerlyzer</Link><Link href="/business">For business</Link><Link href="/guides">Guides</Link><Link href="/about">About</Link><Link href="/methodology">Methodology</Link></footer></div>;
}
