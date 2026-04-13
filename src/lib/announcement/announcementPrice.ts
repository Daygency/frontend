import type { AnnouncementPriceType } from "../apis/announcement/types";

const VALID_TYPES: AnnouncementPriceType[] = [
  "EXPENSE",
  "INCOME",
  "FREE",
  "PENDING",
];

export function normalizeAnnouncementPriceType(
  raw: unknown,
): AnnouncementPriceType {
  if (typeof raw === "string" && VALID_TYPES.includes(raw as AnnouncementPriceType)) {
    return raw as AnnouncementPriceType;
  }
  return "FREE";
}

export function parseAnnouncementPrice(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw));
  }
  return 0;
}

export function priceTypeLabel(t: AnnouncementPriceType): string {
  switch (t) {
    case "EXPENSE":
      return "참가비";
    case "INCOME":
      return "수입";
    case "FREE":
      return "무료";
    case "PENDING":
      return "협의 가능";
    default:
      return "";
  }
}

/** 목록·상세 한 줄 표시 (README: priceType + price 조합) */
export function formatAnnouncementPriceLine(
  priceType: AnnouncementPriceType,
  price: number,
): string {
  const label = priceTypeLabel(priceType);
  if (priceType === "FREE" || priceType === "PENDING") {
    return label;
  }
  const n = typeof price === "number" && Number.isFinite(price) ? price : 0;
  return `${label} · ${n.toLocaleString("ko-KR")}원`;
}

export const PRICE_TYPE_OPTIONS: { label: string; value: AnnouncementPriceType }[] =
  [
    { label: "무료", value: "FREE" },
    { label: "참가비", value: "EXPENSE" },
    { label: "수입", value: "INCOME" },
    { label: "협의 가능", value: "PENDING" },
  ];

/** FormDropdownInput 등에 전달 */
export const PRICE_TYPE_DROPDOWN_ITEMS = PRICE_TYPE_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));
