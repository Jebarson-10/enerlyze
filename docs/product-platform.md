# Enerlyze product platform

The `/shop` catalog and `/calculator` recommendations share `lib/products.ts`.
Every initial product is a sample. Prices, wattages, and capacity are illustrative.
Buying is disabled for preview listings. No demo checkout or payment flow is shown.

To connect a confirmed partner, replace the sample data with verified specifications,
set `sample: false`, and supply its approved HTTPS `buyUrl`. Set `affiliate: true`
only for actual affiliate products. Relevant affiliate matches are prioritized before
payback sorting. No unrelated product is recommended simply for being an affiliate.

Savings are calculated in `lib/recommendations.ts` using the user's wattage, hours,
quantity, tariff, and billing days. Solar is a separate scenario and is capped by
billed usage. Wind has no automatic savings claim without site data. These are
estimates, and AC capacity and variable operation must be checked before comparison.

## Optional AI explanations

The server endpoint `/api/energy-insights` returns a transparent catalog explanation
until both `OPENAI_API_KEY` and `ENERLYZE_AI_MODEL` are configured as hosting secrets.
Keys never reach the browser. The endpoint validates inputs, recomputes catalog
matches, and uses OpenAI's Responses API only to explain those results. It does not
use AI-generated prices or energy calculations. Timeouts and provider errors fall
back to the working comparisons.

Before enabling a paid provider on a public site, configure a provider budget and
hosting rate limits. The AI endpoint is same-origin but has no persistent rate-limit
storage or user authentication. Configure those controls when activating a provider.

API reference: https://developers.openai.com/api/docs/quickstart
