export const deliveryOptions = [
  {
    value: "standard",
    title: "Standard",
    formLabel: "Standard — schedule after scope review",
    description: "The delivery date is agreed after the question and evidence scope have been reviewed.",
  },
  {
    value: "priority",
    title: "Priority",
    formLabel: "Priority — time-sensitive decision",
    description: "For time-sensitive decisions, subject to scope, evidence requirements and availability.",
  },
  {
    value: "critical",
    title: "Critical / 24–48 hours",
    formLabel: "Critical / 24–48 hours — selected assignments only",
    description: "Considered only for selected assignments when the evidence standard remains achievable.",
  },
] as const;

export type DeliveryPriority = (typeof deliveryOptions)[number]["value"];
export const DEFAULT_DELIVERY_PRIORITY: DeliveryPriority = "standard";

export function deliveryOptionFor(value: string) {
  return deliveryOptions.find((option) => option.value === value);
}
