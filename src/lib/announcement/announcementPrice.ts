import type { AnnouncementPriceType } from "../apis/announcement/types";

const VALID_TYPES: AnnouncementPriceType[] = [
  "EXPENSE",
  "INCOME",
  "FREE",
  "PENDING",
];

export type AnnouncementCompensationMode = "none" | "pay" | "negotiable";

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

export function compensationModeFromPriceType(
  priceType: AnnouncementPriceType,
): AnnouncementCompensationMode {
  if (priceType === "PENDING") return "negotiable";
  if (priceType === "INCOME") return "pay";
  return "none";
}

export function resolveAnnouncementPriceSubmit(
  mode: AnnouncementCompensationMode,
  amountText: string,
): { priceType: AnnouncementPriceType; price: number } {
  if (mode === "none") {
    return { priceType: "FREE", price: 0 };
  }
  if (mode === "negotiable") {
    return { priceType: "PENDING", price: 0 };
  }
  const trimmed = amountText.trim().replace(/,/g, "");
  const n = parseInt(trimmed, 10);
  return {
    priceType: "INCOME",
    price: Number.isFinite(n) && n > 0 ? n : 0,
  };
}

export function isAnnouncementPayAmountInvalid(
  mode: AnnouncementCompensationMode,
  amountText: string,
): boolean {
  if (mode !== "pay") return false;
  const trimmed = amountText.trim().replace(/,/g, "");
  if (!trimmed) return true;
  const n = parseInt(trimmed, 10);
  return !Number.isFinite(n) || n <= 0;
}

export function priceTypeLabel(t: AnnouncementPriceType): string {
  switch (t) {
    case "EXPENSE":
      return "참가비";
    case "INCOME":
      return "페이";
    case "FREE":
      return "";
    case "PENDING":
      return "비용협의";
    default:
      return "";
  }
}

/** 목록·상세 한 줄 표시 — FREE(선택안함)는 표시하지 않음 */
export function formatAnnouncementPriceLine(
  priceType: AnnouncementPriceType,
  price: number,
): string | null {
  if (priceType === "FREE") {
    return null;
  }
  if (priceType === "PENDING") {
    return "비용협의";
  }
  const n = typeof price === "number" && Number.isFinite(price) ? price : 0;
  if (priceType === "INCOME") {
    return `${n.toLocaleString("ko-KR")}원`;
  }
  return `${priceTypeLabel(priceType)} · ${n.toLocaleString("ko-KR")}원`;
}

/** 목록 조회(카드 등) — 페이와 비용협의만 표시 */
export function formatAnnouncementPriceLineList(
  priceType: AnnouncementPriceType,
  price: number,
): string | null {
  if (priceType === "PENDING") {
    return "비용협의";
  }
  if (priceType !== "INCOME") {
    return null;
  }
  return formatAnnouncementPriceLine(priceType, price);
}

/** 모집공고 목록 금액 필터 */
export const ANNOUNCEMENT_PRICE_FILTER_ALL = "전체";

export const ANNOUNCEMENT_PRICE_FILTER_LABELS = [
  ANNOUNCEMENT_PRICE_FILTER_ALL,
  "페이",
  "비용협의",
] as const;

function labelToPriceEnum(label: string): AnnouncementPriceType | undefined {
  const t = label.trim();
  if (t === ANNOUNCEMENT_PRICE_FILTER_ALL) return undefined;
  if (t === "페이" || t === "수입") return "INCOME";
  if (t === "비용협의" || t === "협의가능" || t === "협의 가능") {
    return "PENDING";
  }
  if (
    t === "선택안함" ||
    t === "페이 없음" ||
    t === "참가비 없음" ||
    t === "무료"
  ) {
    return "FREE";
  }
  if (t === "참가비") return "EXPENSE";
  if (t === "INCOME" || t === "PENDING" || t === "FREE" || t === "EXPENSE") {
    return t as AnnouncementPriceType;
  }
  return undefined;
}

/**
 * 목록 API `priceType` 단일 쿼리 (ListAnnouncementQueryDto).
 * 여러 금액 유형을 선택한 경우 **첫 번째로 매칭되는 값**만 사용한다.
 */
export function selectedPriceLabelsToApiParam(
  selectedLabels: string[],
): AnnouncementPriceType | undefined {
  const filtered = selectedLabels.filter(
    (label) => label.trim() !== ANNOUNCEMENT_PRICE_FILTER_ALL,
  );
  if (filtered.length === 0) return undefined;
  for (const label of filtered) {
    const e = labelToPriceEnum(label);
    if (e) return e;
  }
  return undefined;
}
