/**
 * 모집공고 목록·태그용 장소 축약 라벨.
 * 예: "서울 서초구 예술의전당" → "서초구"
 * 상세 페이지 지도/주소 영역은 원문 `address`를 그대로 사용합니다.
 */
export function formatAnnouncementDistrictLabel(address: string): string {
  const trimmed = address.trim();
  if (!trimmed) return "";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";

  const district = parts.find(
    (part) => /(?:구|군)$/.test(part) && !/(?:특별시|광역시)$/.test(part),
  );
  if (district) return district;

  const city = parts.find(
    (part) =>
      /시$/.test(part) &&
      !/(?:특별시|광역시|특별자치시)$/.test(part),
  );
  if (city) return city;

  if (parts.some((part) => part.startsWith("세종"))) {
    return "세종";
  }

  if (parts.length === 1) return parts[0];

  return parts[0];
}
