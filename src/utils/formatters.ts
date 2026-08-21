/**
 * Formats a number into standard Indian numbering format (lakhs & crores) with INR symbol (₹)
 * Example: 1250000 -> ₹12,50,000
 * Example: 75000 -> ₹75,000
 * Example: 54000000 -> ₹5,40,00,000
 */
export const formatINR = (amount: number, includeDecimals: boolean = false): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let [integerPart, decimalPart] = absAmount.toFixed(includeDecimals ? 2 : 0).split('.');

  // Indian number grouping: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const formattedString = `₹${formattedInteger}${includeDecimals && decimalPart ? '.' + decimalPart : ''}`;

  return isNegative ? `-${formattedString}` : formattedString;
};

/**
 * Formats standard date string YYYY-MM-DD to Indian format DD/MM/YYYY
 * Example: 2026-08-21 -> 21/08/2026
 */
export const formatIndianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return dateStr;
  }
};

/**
 * Calculates Project Manpower Cost in INR
 * Formula: Monthly Employee Cost × Allocation % × Duration in Months
 */
export const calculateManpowerCost = (
  monthlyCostINR: number,
  allocationPercentage: number,
  durationMonths: number
): number => {
  return Math.round(monthlyCostINR * (allocationPercentage / 100) * durationMonths);
};

/**
 * Calculates GST amount and Grand Total
 * Standard GST rate: 18%
 */
export const calculateGST = (
  subtotal: number,
  gstRatePercent: number = 18
): { subtotal: number; gstAmount: number; grandTotal: number } => {
  const gstAmount = Math.round((subtotal * gstRatePercent) / 100);
  const grandTotal = subtotal + gstAmount;
  return { subtotal, gstAmount, grandTotal };
};
