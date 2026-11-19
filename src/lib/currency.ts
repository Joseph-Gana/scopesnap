import type { CurrencyCode, Milestone, Quote } from './types';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string }> = {
  NGN: { symbol: '₦', label: 'Nigerian Naira' },
  USD: { symbol: '$', label: 'US Dollar' },
  GBP: { symbol: '£', label: 'British Pound' },
  EUR: { symbol: '€', label: 'Euro' },
};

// Money is stored and calculated in integer cents; decimals exist only at the
// display boundary. This makes $1,500.00 exactly 150000 with no float drift.
export function formatMoneyFromCents(cents: number, currency: CurrencyCode): string {
  const { symbol } = CURRENCIES[currency];
  const safe = Math.round(Number(cents) || 0);
  const formatted = (safe / 100).toLocaleString('en-US', {
    minimumFractionDigits: safe % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function totalPercentage(milestones: Milestone[]): number {
  return milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);
}

// Largest-remainder allocation: each milestone gets its exact percentage share
// of the total in cents, and leftover cents go to the largest fractional
// remainders, so amounts always sum to exactly the project total.
export function milestoneAmounts(milestones: Milestone[], totalCents: number): number[] {
  const total = Math.round(Number(totalCents) || 0);
  const exact = milestones.map((m) => ((Number(m.percentage) || 0) / 100) * total);
  const allocated = exact.map((value) => Math.floor(value));
  let leftover = total - allocated.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  let cursor = 0;
  while (leftover > 0 && order.length > 0) {
    allocated[order[cursor % order.length].index] += 1;
    leftover -= 1;
    cursor += 1;
  }
  return allocated;
}

export function quoteIsBalanced(quote: Quote): boolean {
  return quote.totalCents > 0 && totalPercentage(quote.milestones) === 100;
}
