# Search and AI discoverability monitoring

Do not infer an indexing or ranking outcome from a successful deployment. Google explicitly says [AI search features use the same foundational SEO practices](https://developers.google.com/search/docs/appearance/ai-features), with no required AI-only file or special schema; indexing is not guaranteed. `public/llms.txt` is a factual navigation aid, not an AI ranking mechanism.

## Per deployment

Run `npm test`, `npx tsc --noEmit`, `npm run build`, then start the built worker and run `npm run check:seo -- <local-base>`. After publication, repeat the SEO crawl against `https://www.enerlyze.in`. Check the homepage, calculator, shop, an article, robots and sitemap manually in desktop and mobile layouts. Confirm the apex redirects without loops. Check the admin remains noindex and functional.

## Weekly owner review

- In Google Search Console (canonical **www** property), review Pages indexing exclusions, submitted sitemap processing, crawl errors, queries, impressions, clicks and pages. Compare branded searches separately from non-branded informational queries.
- In Bing Webmaster Tools, add/verify the canonical host, submit the sitemap once, and review crawl/index coverage. Do not repeatedly submit unchanged URLs or enable IndexNow without a secure key/workflow.
- Check new guide performance by query intent and internal CTA clicks where privacy-safe analytics are configured. Maintain a dated log of changes so a traffic movement can be interpreted.

## Monthly/quarterly review

- Review useful traffic and qualified business enquiries, not rank alone. Check mobile Core Web Vitals field data if enough traffic exists; otherwise record a repeatable lab result with device/network settings and date.
- Recheck tariff orders, the CEA factor, business scope, product sample status, broken source links and any changed contact detail. Change article `updated` dates only for substantive revisions.
- Test a fixed set of prompts in major answer engines, including “What is Enerlyzer?”, “How can I estimate electricity-related carbon emissions in India?”, “How does a KSEB bill translate to kWh?” and “What does Enerlyze do for businesses?”. Log date, engine, response, citation URL and factual accuracy. Presence in an answer is not equivalent to measured referral traffic.

## Analytics readiness

No GA4 or other production analytics tag was found, and no measurement ID or consent workflow was supplied. No tracking was installed. When the owner chooses an analytics provider and completes a suitable consent/privacy setup, implement a single tag and document event names: `calculator_open`, `calculator_start`, `calculator_complete`, `guide_cta_click`, `methodology_view`, `business_enquiry_start` and `outbound_partner_click`. Do not send bill amounts, appliance inventories, names, emails, messages or other personal data as event parameters. `business_enquiry_submit` is not applicable to the current `mailto:` flow, which provides no confirmed submission callback. Attribute identifiable AI referrals conservatively; some referrals carry no referrer.

## Owner actions

1. Inspect the Search Console **www** property after deployment, submit `/sitemap.xml`, and request indexing of a small number of priority new URLs if appropriate. The existing verification token in code is not proof of current access or indexing.
2. Verify the www property and sitemap in Bing Webmaster Tools.
3. Review the public Kerala Startup Mission profile, Google Business Profile eligibility/details and public business contact consistency. Claim only categories, address and hours that accurately represent the operation; do not invent reviews or locations.
4. Supply confirmed product specifications, seller links and prices before enabling Buy controls or Offer schema.
