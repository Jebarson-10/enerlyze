# Implementation report — 21 October 2026

## Shipped in source

- Central metadata/social/canonical helper; canonical www host redirect for the exact apex; expanded native sitemap; retained public robots and admin noindex.
- Consistent legal and product entity descriptions, Organization/WebSite/WebApplication/Service/Breadcrumb/Article markup, without fake ratings or preview-product offers.
- About, Enerlyzer facts and calculation methodology pages; eight linked and sourced guides; expanded visible calculator explanation and ten reader FAQs; homepage knowledge section and cross-links.
- Homepage-only startup animation on public informational pages, improved dark-mode guide contrast, compressed industrial WebP asset with original preserved for compatibility.
- Automated local route crawl in `scripts/check-seo.mjs`; carbon tests added alongside the existing tariff tests.
- Industrial visual transcoded from a 2,758,949-byte PNG to a 237,610-byte WebP (91.4% smaller). The original remains for existing admin references. The production build still reports a >500 kB chunk; its largest observed client asset is the 736,800-byte uncompressed Three.js module used by the existing immersive homepage. This is a build-artifact observation, not a Core Web Vitals score.

## Validation and status

Source checks performed during implementation: TypeScript passed; five unit tests passed; lint passed (with scoped exceptions for existing animation and vendored code); Vinext production build passed; local SEO crawl checked 16 indexable routes and 16 internal destinations, sitemap, robots, JSON-LD, H1/canonicals and 404. Browser inspection covered guide and methodology content in light/dark and phone/desktop widths, plus an interactive bill/period calculator check. A dark-guide contrast issue and cramped mobile navigation were corrected. Final deployed URL, production checks and GitHub commit are to be recorded after release.

## Remaining risks and owner work

- Production D1-approved SEO fields may override revised code defaults; inspect final live metadata.
- The CEA v22 direct PDF was access-gated during this review; revalidate the retained 0.675 factor from the official table at the next methodology review. Tariffs and incentive rules also require periodic review.
- No analytics tracking was enabled without a configured provider and consent workflow. Search Console/Bing access, index coverage and actual rankings require owner-side verification and time. `/llms.txt` does not guarantee AI citation.
- Current shop entries remain previews with disabled Buy controls. No verified partner catalog, Offer schema or checkout was invented.
- A successful automated crawl is not a Lighthouse/Core Web Vitals result. Record field or reproducible lab metrics before making performance claims.
