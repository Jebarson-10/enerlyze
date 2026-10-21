# Implementation plan and decisions

1. Preserve the functioning calculator, admin approval workflow, light/dark design and homepage tagline. Keep Enerlyze as company/brand, Enerlyzer as the product and `www.enerlyze.in` as canonical.
2. Use one metadata helper for absolute canonical paths, social cards and indexable-route defaults. Retain admin-editable metadata on the four existing public routes. Redirect only the exact public apex host in `proxy.ts`, leaving local/Sites preview hosts and sign-in flows untouched.
3. Expand the native sitemap from guide data. Keep admin/API out of it; keep admin `noindex`. Add visible breadcrumb trails and matching JSON-LD, with Organization/WebSite, WebApplication, Service and Article types only where true to the page.
4. Publish an About page, Enerlyzer facts, methodology and eight original guides with sources and limitations. Avoid hard tariff figures in prose where current utility adjustments may vary. Do not add fake testimonials, partner offers, FAQ rich-result promises or product Offer markup for samples.
5. Make the existing calculator page explain bill-to-unit inversion, appliance breakdown, carbon boundary, sample products and payback in initial HTML. Leave calculation code unchanged and add relevant links.
6. Improve cross-links and mobile/dark readability; serve the homepage intro only on the homepage; compress the existing industrial image to WebP while retaining its original as an admin-compatible fallback.
7. Run TypeScript, unit tests, production build, local route crawl, sitemap/schema parse, internal link checks and mobile/desktop visual inspection. Deploy through the existing Sites project and push to the existing GitHub repository only after checks.

Analytics are deliberately not active: no measurement ID or consent flow exists. The monitoring plan defines events and owner setup steps without inserting a placeholder or collecting visitor data by default.
