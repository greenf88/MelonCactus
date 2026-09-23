export const deliveryOptions = [
  {
    value: "standard",
    title: "Standard delivery",
    formLabel: "Standard delivery",
    multiplier: 1,
    surcharge: "No surcharge",
    description: "Delivery date confirmed after scope review.",
  },
  {
    value: "within-48-hours",
    title: "Priority: within 48 hours",
    formLabel: "Within 48 hours — 2× project fee",
    multiplier: 2,
    surcharge: "100% surcharge",
    description: "The total is twice the final agreed project fee.",
  },
  {
    value: "within-24-hours",
    title: "Urgent: within 24 hours",
    formLabel: "Within 24 hours — 3× project fee",
    multiplier: 3,
    surcharge: "200% surcharge",
    description: "The total is three times the final agreed project fee.",
  },
] as const;

export type DeliveryPriority = (typeof deliveryOptions)[number]["value"];
export const DEFAULT_DELIVERY_PRIORITY: DeliveryPriority = "standard";

export function deliveryOptionFor(value: string) {
  return deliveryOptions.find((option) => option.value === value);
}

export function calculateDeliveryTotal(agreedFee: number, priority: DeliveryPriority) {
  const option = deliveryOptionFor(priority);
  if (!option || !Number.isFinite(agreedFee) || agreedFee < 0) {
    throw new Error("Invalid delivery calculation");
  }
  return agreedFee * option.multiplier;
}
