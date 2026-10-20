import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatedBill, estimateUnits, estimatedAvoidableRate, tamilNaduBimonthlyBill } from '../lib/tariffs.ts';

test('bill inversion across monthly and bi-monthly schedules', () => {
  for (const [region, months, samples] of [
    ['kerala', 1, [50, 100, 150, 250, 251, 300, 600]],
    ['kerala', 2, [50, 200, 500, 700]],
    ['tamil-nadu', 2, [250, 400, 500, 501, 800]],
    ['tamil-nadu', 1, [125, 250, 300]],
  ]) {
    for (const units of samples) {
      const amount = estimatedBill(units, region, months);
      assert.equal(estimateUnits(amount, region, months).units, units, `${region} ${months}m ${units}kWh`);
    }
  }
});

test('subsidy boundary is explicit and does not inflate savings rate', () => {
  assert.equal(tamilNaduBimonthlyBill(500), 1570);
  assert.ok(tamilNaduBimonthlyBill(501) > 2000);
  assert.equal(estimateUnits(0, 'tamil-nadu', 2).units, 100);
  assert.match(estimateUnits(0, 'tamil-nadu', 2).ambiguity, /0 to 200/);
  assert.equal(estimatedAvoidableRate(500, 'tamil-nadu', 2), 6.3);
  assert.equal(estimatedAvoidableRate(251, 'kerala', 1), 6.75);
});

test('other regions use the bill rate and fixed charge supplied by the visitor', () => {
  assert.equal(estimateUnits(1150, 'other', 1, 10, 150).units, 100);
  assert.equal(estimateUnits(2300, 'other', 2, 10, 150).units, 200);
});
