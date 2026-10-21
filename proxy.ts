import {NextResponse, type NextRequest} from 'next/server';

// Only redirect the public custom domains. Keep Sites preview, auth callbacks,
// and local development on their original hosts.
export function proxy(request:NextRequest){
  const url=request.nextUrl.clone();
  if(url.hostname==='enerlyze.in'||(url.hostname==='www.enerlyze.in'&&url.protocol==='http:')){
    url.protocol='https:';
    url.hostname='www.enerlyze.in';
    return NextResponse.redirect(url,308);
  }
  return NextResponse.next();
}
