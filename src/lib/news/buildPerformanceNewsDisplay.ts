import { formatPerformanceListDateLabel } from "./formatPerformanceOpenLabel";
import type { NewsListItem } from "../apis/news/types";
import { isContentNew } from "../content/newBadge";

export type PerformanceNewsDisplay = {
  openLabel: string;
  priceLabel: string | null;
  isHot: boolean;
  isExclusive: boolean;
  hasMultipleSessions: boolean;
};

export function formatNewsTicketPrice(
  ticketPrice?: number | null,
): string | null {
  if (ticketPrice == null || !Number.isFinite(ticketPrice)) return null;
  if (ticketPrice === 0) return "무료";
  return `${ticketPrice.toLocaleString("ko-KR")}원`;
}

/** 기존 목록 API 필드만으로 카드 표시값 계산 */
export function buildPerformanceNewsDisplay(
  item: NewsListItem,
): PerformanceNewsDisplay {
  const likeCount = item.likeCount ?? 0;
  const isNew = isContentNew(item.createdAt);

  return {
    openLabel: formatPerformanceListDateLabel(item.startedAt, item.endedAt),
    priceLabel: formatNewsTicketPrice(item.ticketPrice),
    isHot: likeCount >= 5,
    isExclusive: isNew && likeCount >= 1,
    hasMultipleSessions: false,
  };
}
