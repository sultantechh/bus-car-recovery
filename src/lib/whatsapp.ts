// Central WhatsApp booking contact.
export const WHATSAPP_NUMBER = "254799260771"; // 0799 260771 in international format
export const WHATSAPP_DISPLAY = "0799 260771";

// Lipa na Pochi payment details.
export const LIPA_NA_POCHI_NUMBER = "254799260771";
export const LIPA_NA_POCHI_DISPLAY = "0799 260771";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Apply the promotional discount used across the site (20% off upstream fares).
export const PRICE_DISCOUNT = 0.8;
export function discounted(amount?: string | number | null): number | null {
  if (amount === null || amount === undefined || amount === "") return null;
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!isFinite(n)) return null;
  return Math.round(n * PRICE_DISCOUNT);
}
