# Structured data implementation

- Root: `Organization` (legal name Enerlyze Private Limited; alternate name Enerlyze; public contact and Kerala locality from existing site content) and `WebSite`, with stable IDs under the www origin. The Kerala Startup Mission public profile is the single `sameAs` entity reference.
- `/calculator`: `WebApplication` identifies Enerlyzer as a free web tool and links its publisher to the Organization. No fake ratings, downloads or prices.
- `/business`: `Service` describes scoped energy analysis, without suggesting certification or guaranteed results.
- `/guides/[slug]`: `Article` with actual publication/revision dates, headline, main URL and organization author/publisher. Source links appear visibly in the article.
- Informational routes and service pages: `BreadcrumbList` matching visible or clear navigational hierarchy. No FAQPage markup is used; visible calculator FAQs are for readers, not a rich-result promise.
- `/shop`: no `Product`/`Offer` markup for sample catalog entries. Add only after verified live listings, specifications and merchant URLs exist.

`SeoJsonLd` serializes values through `jsonLd`, escaping `<` to prevent script-breakout. `npm run check:seo` parses each public route's JSON-LD and checks metadata/canonical/H1; external rich-result eligibility remains Google's decision. Google’s [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) require markup to represent visible content and do not guarantee a display feature.
