# Claim and methodology sources

| Topic | Implementation | Primary reference and review action |
| --- | --- | --- |
| Company identity and location | Enerlyze Private Limited, Thiruvananthapuram, Kerala | [Kerala Startup Mission public profile](https://startups.startupmission.in/startups/pzvOl); profile also describes aspirational capabilities, which this site does **not** present as live. Reconfirm legal/contact details with the owner when they change. |
| Grid electricity CO₂ | `lib/carbon.ts`: editable default 0.675 kg CO₂/kWh, an average location-based illustration | [CEA baseline database listing](https://cea.nic.in/cdm-co2-baseline-database/?lang=en), v22 user guide; original project documentation recorded a check on 2026-09-28. The direct PDF was access-gated during this SEO review, so the numeric value was retained without claiming fresh independent revalidation. Recheck Table S at the next source review. |
| Kerala domestic tariff | `lib/tariffs.ts` domestic slab/fixed-charge approximation | [KSERC tariff order PDF](https://dev.erckerala.org/api/storage/orders/o0sDy6ZmrpxIKwgD9dz8lMNuYvVEq11l9P1VcHeP.pdf). Confirm current order, service category, concessions and dates before treating an inversion as bill verification. |
| Tamil Nadu domestic tariff | `lib/tariffs.ts` bimonthly model and subsidy boundary | [TNERC](https://www.tnerc.tn.gov.in/). No automatic live tariff feed exists; update model when a new applicable order is verified. |
| Appliance energy | Watts × hours × quantity × days ÷ 1,000 | Physical unit conversion; [Bureau of Energy Efficiency](https://beeindia.gov.in/) for current appliance labelling context. User-adjustable nominal hours are assumptions, not observations. |
| Business emissions boundary | Electricity-related estimate versus full inventory | [GHG Protocol Scope 2 Guidance](https://ghgprotocol.org/scope-2-guidance) and [Corporate Standard](https://ghgprotocol.org/corporate-standard). No assurance or certification claim. |
| Solar | Generation/self-consumption scenario and simple payback | [MNRE rooftop solar programme](https://mnre.gov.in/en/grid-connected-solar-rooftop-programme/) and [official PM Surya Ghar portal](https://solarrooftop.pmsuryaghar.gov.in/). No fixed subsidy promise; check eligibility and local settlement. |
| Equivalences | Car distance and annual urban-tree comparison | [US EPA Equivalencies Calculator assumptions](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references). Not an offset, tree planting claim or site-specific car calculation. |

See `/methodology` for the visitor-facing boundary. Content should be reviewed at least quarterly and promptly after a new tariff, emissions database or product listing.
