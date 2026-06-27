import type { AnnouncementPriceType } from "../apis/announcement/types";

const VALID_TYPES: AnnouncementPriceType[] = [
  "EXPENSE",
  "INCOME",
  "FREE",
  "PENDING",
];

/** README: priceType 생략 시 서버 기본은 PENDING(협의) */
export function normalizeAnnouncementPriceType(
  raw: unknown,
): AnnouncementPriceType {
  if (typeof raw === "string" && VALID_TYPES.includes(raw as AnnouncementPriceType)) {
    return raw as AnnouncementPriceType;
  }
  return "PENDING";
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
      return "페이";
    case "FREE":
      return "무료";
    case "PENDING":
      return "비용협의";
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
  if (priceType === "INCOME") {
    return `${n.toLocaleString("ko-KR")}원`;
  }
  return `${label} · ${n.toLocaleString("ko-KR")}원`;
}

/** 목록 조회(카드 등) — PENDING은 `비용협의` */
export function formatAnnouncementPriceLineList(
  priceType: AnnouncementPriceType,
  price: number,
): string {
  if (priceType === "PENDING") {
    return "비용협의";
  }
  return formatAnnouncementPriceLine(priceType, price);
}

export const PRICE_TYPE_OPTIONS: { label: string; value: AnnouncementPriceType }[] =
  [
    { label: "무료", value: "FREE" },
    { label: "페이", value: "INCOME" },
    { label: "비용협의", value: "PENDING" },
  ];

/** FormDropdownInput 등에 전달 */
export const PRICE_TYPE_DROPDOWN_ITEMS = PRICE_TYPE_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));

/** 모집공고 태그 필터 모달 — 표시 라벨 목록 */
export const ANNOUNCEMENT_PRICE_FILTER_LABELS = PRICE_TYPE_OPTIONS.map(
  (o) => o.label,
);

function labelToPriceEnum(label: string): AnnouncementPriceType | undefined {
  const t = label.trim();
  const byLabel = PRICE_TYPE_OPTIONS.find((o) => o.label === t)?.value;
  if (byLabel) return byLabel;
  if (t === "수입") return "INCOME";
  if (t === "참가비") return "EXPENSE";
  if (t === "비용협의" || t === "협의가능" || t === "협의 가능") {
    return "PENDING";
  }
  const byValue = PRICE_TYPE_OPTIONS.find((o) => o.value === t)?.value;
  return byValue;
}

/**
 * 목록 API `priceType` 단일 쿼리 (ListAnnouncementQueryDto).
 * 여러 금액 유형을 선택한 경우 **첫 번째로 매칭되는 값**만 사용한다.
 */
export function selectedPriceLabelsToApiParam(
  selectedLabels: string[],
): AnnouncementPriceType | undefined {
  if (selectedLabels.length === 0) return undefined;
  for (const label of selectedLabels) {
    const e = labelToPriceEnum(label);
    if (e) return e;
  }
  return undefined;
}
