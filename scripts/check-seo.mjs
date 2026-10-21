import assert from 'node:assert/strict';
import {guides} from '../lib/guides.ts';

const base=(process.argv[2]||'http://127.0.0.1:8787').replace(/\/$/,'');
const canonical='https://www.enerlyze.in';
const routes=['/','/calculator','/business','/services','/shop','/about','/enerlyzer','/methodology','/guides',...guides.map(guide=>`/guides/${guide.slug}`)];
const text=(html,pattern)=>html.match(pattern)?.[1]||'';
const attr=(tag,name)=>tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]||'';
const tagBy=(html,pattern)=>html.match(pattern)?.[0]||'';
const seenTitles=new Set(),seenDescriptions=new Set();
const links=new Set();

for(const path of routes){
  const response=await fetch(`${base}${path}`);
  assert.equal(response.status,200,`${path} status`);
  const html=await response.text();
  const title=text(html,/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description=attr(tagBy(html,/<meta\s+name="description"[^>]*>/i),'content');
  const canonicalTag=attr(tagBy(html,/<link\s+rel="canonical"[^>]*>/i),'href');
  const ogTitle=attr(tagBy(html,/<meta\s+property="og:title"[^>]*>/i),'content');
  const ogDescription=attr(tagBy(html,/<meta\s+property="og:description"[^>]*>/i),'content');
  const twitterCard=attr(tagBy(html,/<meta\s+name="twitter:card"[^>]*>/i),'content');
  const h1Count=(html.match(/<h1(?:\s|>)/gi)||[]).length;
  assert.ok(title.length>18,`${path} meaningful title`);
  assert.ok(description.length>60,`${path} meaningful description`);
  assert.ok(!seenTitles.has(title),`${path} unique title`);
  assert.ok(!seenDescriptions.has(description),`${path} unique description`);
  seenTitles.add(title);seenDescriptions.add(description);
  assert.equal(canonicalTag,`${canonical}${path==='/'?'':path}`,`${path} canonical`);
  assert.ok(ogTitle&&ogDescription&&twitterCard,`${path} social metadata`);
  assert.equal(h1Count,1,`${path} exactly one H1`);
  assert.doesNotMatch(html,/<meta\s+name="robots"[^>]*noindex/i,`${path} indexable`);
  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.ok(schemas.length>0,`${path} JSON-LD`);
  for(const [,json] of schemas)assert.ok(JSON.parse(json),`${path} parsable JSON-LD`);
  for(const [,href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/gi)){
    const target=href.split(/[?#]/)[0];
    if(target&&!target.startsWith('/_next/')&&!target.startsWith('/signin-'))links.add(target);
  }
  console.log(`✓ ${path}: metadata, H1, canonical, JSON-LD`);
}

const sitemapResponse=await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status,200,'sitemap status');
const xml=await sitemapResponse.text();
const sitemapUrls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1].replaceAll('&amp;','&'));
assert.equal(sitemapUrls.length,routes.length,'sitemap route count');
assert.equal(new Set(sitemapUrls).size,sitemapUrls.length,'sitemap has no duplicates');
for(const path of routes)assert.ok(sitemapUrls.includes(`${canonical}${path}`),`${path} in sitemap`);
assert.ok(!sitemapUrls.some(url=>url.includes('/admin')||url.includes('/api/')),'private routes omitted');

const robotsResponse=await fetch(`${base}/robots.txt`);
assert.equal(robotsResponse.status,200,'robots status');
const robots=await robotsResponse.text();
assert.match(robots,/Sitemap: https:\/\/www\.enerlyze\.in\/sitemap\.xml/i);
assert.match(robots,/Disallow: \/admin\//i);
for(const target of links){
  const response=await fetch(`${base}${target}`,{redirect:'manual'});
  assert.ok(response.status===200||response.status===308,`${target} internal link returned ${response.status}`);
}
assert.equal((await fetch(`${base}/this-page-does-not-exist`)).status,404,'missing page 404');
assert.equal((await fetch(`${base}/admin`)).status,200,'admin route available');
console.log(`✓ ${routes.length} indexable routes, ${links.size} internal destinations, sitemap, robots, 404`);
