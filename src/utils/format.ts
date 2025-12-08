// src/utils/format.ts

/**
 * Formats a number into a string with locale-specific separators.
 * This function is safe to use in both SSR and CSR contexts to prevent
 * hydration mismatches.
 *
 * @param number The number to format.
 * @param locale The locale to use for formatting (e.g., 'id-ID'). Defaults to 'id-ID'.
 * @returns A formatted number string.
 */
export const formatNumber = (number: number, locale: string = 'id-ID'): string => {
  if (typeof number !== 'number') {
    return '';
  }
  return number.toLocaleString(locale);
};

/**
 * Formats a number as a currency string for a given locale.
 *
 * @param number The number to format.
 * @param currency The currency code (e.g., 'IDR'). Defaults to 'IDR'.
 * @param locale The locale to use. Defaults to 'id-ID'.
 * @returns A formatted currency string (e.g., "Rp 10.000").
 */
export const formatCurrency = (
  number: number,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string => {
  if (typeof number !== 'number') {
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number).replace(/\s/g, ' ');
};