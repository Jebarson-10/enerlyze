export type Region = 'kerala' | 'tamil-nadu' | 'other';
export type BillingMonths = 1 | 2;

export const TARIFF_SOURCES = {
  kerala: 'https://dev.erckerala.org/api/storage/orders/o0sDy6ZmrpxIKwgD9dz8lMNuYvVEq11l9P1VcHeP.pdf',
  tamilNadu: 'https://www.tnerc.tn.gov.in/',
} as const;

const KERALA_SLABS = [
  { cap: 50, rate: 3.35 }, { cap: 100, rate: 4.25 },
  { cap: 150, rate: 5.35 }, { cap: 200, rate: 7.2 },
  { cap: 250, rate: 8.5 },
];

function telescopic(units: number, slabs: { cap: number; rate: number }[]) {
  let previous = 0;
  let charge = 0;
  for (const slab of slabs) {
    charge += Math.max(0, Math.min(units, slab.cap) - previous) * slab.rate;
    previous = slab.cap;
  }
  return charge;
}

/** LT-I domestic, ordinary single-phase, excludes duty, fuel surcharge and special concessions. */
export function keralaMonthlyBill(units: number): number {
  const u = Math.max(0, units);
  if (u <= 250) {
    const fixed = u <= 50 ? 50 : u <= 100 ? 85 : u <= 150 ? 105 : u <= 200 ? 140 : 160;
    return fixed + telescopic(u, KERALA_SLABS);
  }
  const rate = u <= 300 ? 6.75 : u <= 350 ? 7.6 : u <= 400 ? 7.95 : u <= 500 ? 8.25 : 8.2;
  const fixed = u <= 300 ? 220 : u <= 350 ? 240 : u <= 400 ? 260 : u <= 500 ? 285 : 310;
  return fixed + u * rate;
}

/** LT-IA domestic, consumer-facing 2026 subsidy, two-month billing cycle. */
export function tamilNaduBimonthlyBill(units: number): number {
  const u = Math.max(0, units);
  const free = u <= 500 ? 200 : 100;
  return telescopic(u, [
    { cap: free, rate: 0 },
    { cap: 400, rate: 4.7 },
    { cap: 500, rate: 6.3 },
    { cap: 600, rate: 8.4 },
    { cap: 800, rate: 9.45 },
    { cap: 1000, rate: 10.5 },
    { cap: Number.POSITIVE_INFINITY, rate: 11.55 },
  ]);
}

export function estimatedBill(units: number, region: Region, months: BillingMonths, customRate = 8, customFixed = 0): number {
  if (region === 'kerala') return keralaMonthlyBill(units / months) * months;
  if (region === 'tamil-nadu') return tamilNaduBimonthlyBill(units * 2 / months) * months / 2;
  return Math.max(0, units) * Math.max(0, customRate) + Math.max(0, customFixed) * months;
}

export function estimateUnits(amount: number, region: Region, months: BillingMonths, customRate = 8, customFixed = 0) {
  const rupees = Math.max(0, Number.isFinite(amount) ? amount : 0);
  if (region === 'other') {
    return { units: customRate > 0 ? Math.max(0, (rupees - customFixed * months) / customRate) : 0,
      ambiguity: customRate > 0 ? '' : 'Enter a rate above zero to estimate units.' };
  }
  // Search whole units because fixed-charge and subsidy thresholds introduce jumps.
  const maxUnits = Math.max(6000, Math.ceil(rupees / 2) + 1000);
  let bestUnits = 0;
  let bestError = Number.POSITIVE_INFINITY;
  for (let units = 0; units <= maxUnits; units++) {
    const error = Math.abs(estimatedBill(units, region, months) - rupees);
    if (error < bestError) { bestError = error; bestUnits = units; }
  }
  if (region === 'tamil-nadu' && rupees < 1) {
    return { units: 50 * months, ambiguity: `A ₹0 bill can represent 0 to ${100 * months} subsidized units. We use the midpoint for the footprint estimate; check the meter reading for a precise result.` };
  }
  const precision = bestError > Math.max(25, rupees * 0.03)
    ? `The closest tariff step differs by ₹${Math.round(bestError)}. Your actual units may differ because of bill adjustments.`
    : '';
  return { units: bestUnits, ambiguity: precision };
}

export function estimatedAvoidableRate(units: number, region: Region, months: BillingMonths, customRate = 8) {
  if (region === 'other') return Math.max(0, customRate);
  if (units <= 0) return 0;
  // Use the lower local slope so fixed-charge and subsidy cliffs do not inflate savings.
  const step = Math.min(10, units);
  const backward = (estimatedBill(units, region, months) - estimatedBill(units - step, region, months)) / step;
  const forward = (estimatedBill(units + step, region, months) - estimatedBill(units, region, months)) / step;
  return Math.max(0, Math.min(12, backward, forward));
}
