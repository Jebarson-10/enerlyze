# SEO baseline audit — 21 October 2026

Evidence: repository at the start of this change, plus read-only HTTP checks of the public domains. No ranking, indexing, traffic or Lighthouse data was available.

## Application

- Vinext 1.0.0-beta.5 implementing Next.js App Router 16.2.6, React 19, TypeScript, npm lockfile; Cloudflare Worker on Sites with D1 for approved admin content and R2 for uploaded images.
- Public routes before this work: `/`, `/calculator`, `/business`, `/shop`; `/admin` is an authenticated console with `noindex` metadata, and `/api/*` serves application operations. The homepage initial experience and company overview were server-rendered, with interactive mode switching and 3D visuals hydrated in the browser. The calculator explanation was in initial HTML; calculations run in client code.
- Page titles before this work came from `lib/content-fields.ts` defaults or approved D1 overrides: homepage “Enerlyze | Energy Analytics, Carbon Insights & Enerlyzer”; calculator “Enerlyzer: Electricity Bill, Appliance & Carbon Calculator”; business “Business Energy Analytics, Carbon & ESG Reporting”; shop “Efficient Energy Products.” Each had a corresponding description in the same field map. Overrides may differ in production.
- `metadataBase` and route canonicals used `https://www.enerlyze.in`; homepage root layout had Open Graph/Twitter defaults and Google verification. Organization and WebSite JSON-LD were present; WebApplication and Service schema existed on calculator and business. No guide, About, methodology or breadcrumb schema existed.
- `/sitemap.xml` listed the four public routes. `/robots.txt` allowed public crawling, disallowed `/api/` and `/admin/`, and linked the www sitemap. Admin additionally carried `noindex`.
- Internal links primarily connected the homepage to the three service routes. There was no sourced educational content hub or clear product-facts page. The shop already identified preview listings and disabled purchases without confirmed links.
- Existing checks: `tests/tariffs.test.mjs` covered tariff inversion and subsidy boundaries. No automatic route metadata/sitemap/link check or recorded mobile visual review was present. No GA4 or other production analytics tag was found in application source. Search Console verification token existed, but repository access alone does not prove property verification or indexing.

## Live observations before edits

- Both `https://enerlyze.in/` and `https://www.enerlyze.in/` returned 200, so the apex duplicated the canonical host at the response level. HTTP apex redirected and a trailing slash on `/calculator/` redirected to `/calculator`; an unknown path returned 404. The www sitemap and robots files returned 200.
- The old homepage tagline “Your personal partner for a greener lifestyle” is established user-approved brand copy and has been retained. The new factual positioning appears nearby rather than replacing it.

## Known limits

- D1-approved copy can override source defaults. A release must inspect final live metadata, not infer it solely from code.
- The current electricity factor and tariff tables require periodic source review; this SEO change does not alter the calculator engine.
- Search Console coverage, actual Google/Bing indexing, organic ranking, referral traffic and Core Web Vitals field data were not available through the repository. They are external monitoring tasks.
