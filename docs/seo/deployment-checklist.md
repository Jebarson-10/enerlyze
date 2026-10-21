# SEO release checklist

- [ ] `git status` inspected; no unrelated files or secrets included.
- [ ] New and changed editorial facts reviewed against `methodology-sources.md`; product previews and roadmap distinguished from live features.
- [ ] `npm test` and `npx tsc --noEmit` pass.
- [ ] `npm run build` passes with the current Sites/Vinext configuration.
- [ ] Built server passes `npm run check:seo -- http://127.0.0.1:8787` (all indexable routes, metadata, H1, canonical, JSON-LD, sitemap, robots, links, 404).
- [ ] Calculator amount, region, period, appliance and CO₂ flows checked without changing tariff/carbon calculations.
- [ ] Representative home, guide and calculator pages checked in light/dark and narrow/wide layouts.
- [ ] Apex-to-www redirect, HTTPS, sitemap and canonical tags verified on the actual deployment.
- [ ] Admin remains accessible only through its existing authentication/approval process and has `noindex`.
- [ ] Push source to the existing GitHub repository and matching Sites source; deploy the archive-backed version using the Sites workflow. Keep credentials out of command lines and files.
- [ ] Re-run public SEO crawl, confirm live version and record any difference from source defaults caused by D1-approved metadata.
- [ ] Owner submits/monitors Google and Bing sitemaps; no immediate ranking/indexing claim.
