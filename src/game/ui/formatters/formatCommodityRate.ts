/**
 * Formats the given number in such a way, that if it is above **1.0**
 * it is formatted rounded to one decimal, else it is formatted to
 * 2 decimal points and the leading zero on the left is trimmed.
 *
 * **Examples outputs**:
 *
 * - ".01"
 * - ".50"
 * - ".99"
 * - "1"
 * - "9"
 * - "120"
 */
export function formatCommodityRate(rate: number) {
  return rate >= 1.0 ? rate.toFixed(0) : rate.toFixed(2).replace(/^0/, "");
}
