/**
 * 모집공고 목록/홈 등에서 내려오는 전공 필드 파싱 (camelCase·snake_case·중첩 majors)
 */
export function pickMajorsFromAnnouncementRaw(raw: unknown): {
  majorIds?: string[];
  majors?: { majorId: string; name: string }[];
} {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const out: {
    majorIds?: string[];
    majors?: { majorId: string; name: string }[];
  } = {};
  const ids = r.majorIds ?? r.major_ids;
  if (Array.isArray(ids) && ids.length > 0) {
    out.majorIds = ids.map((x) => String(x));
  }
  const majors = r.majors;
  if (Array.isArray(majors) && majors.length > 0) {
    const parsed = majors
      .map((m) => {
        if (!m || typeof m !== "object") return null;
        const o = m as Record<string, unknown>;
        const majorId = String(o.majorId ?? o.major_id ?? "");
        const name = String(o.name ?? "").trim();
        if (!majorId && !name) return null;
        return { majorId, name };
      })
      .filter(Boolean) as { majorId: string; name: string }[];
    if (parsed.length) out.majors = parsed;
  }
  return out;
}

/** 목록 등 raw에서 장소 문자열 (camelCase·대문자 변형) */
export function pickAddressFromAnnouncementRaw(
  raw: unknown,
): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const v = r.address ?? r.Address;
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

/**
 * 목록·홈 등 raw에서 마감일 ISO 문자열.
 * 백엔드는 `deadlineAt`을 반환한다. 구버전 호환용으로 `deadline_at`도 읽는다.
 */
export function pickDeadlineAtFromAnnouncementRaw(
  raw: unknown,
): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const v = r.deadlineAt ?? r.deadline_at;
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

/**
 * 카드/리스트에 표시할 전공 이름 배열 (API가 이름을 주면 우선, 없으면 majorIds + 카탈로그로 매핑)
 */
/**
 * 모집 전공 칩 선택값 → API용 UUID 배열 (value가 비어 있으면 제외)
 */
export function buildMajorIdsForSubmit(
  selectedKeys: string[],
  options: { label: string; value: string }[],
): string[] {
  const ids: string[] = [];
  for (const key of selectedKeys) {
    const opt = options.find((m) => (m.value || m.label) === key);
    if (!opt) continue;
    const v = String(opt.value ?? "").trim();
    if (v) ids.push(v);
  }
  return ids;
}

export function resolveRecruitmentMajorDisplayNames(
  item: {
    majorIds?: string[];
    majors?: { majorId: string; name: string }[];
  },
  catalog: { name: string; majorId: string }[],
): string[] {
  if (item.majors?.length) {
    const names = item.majors.map((m) => m.name).filter(Boolean);
    return [...new Set(names)];
  }
  if (item.majorIds?.length && catalog.length > 0) {
    const names = item.majorIds
      .map((id) => catalog.find((m) => m.majorId === id)?.name)
      .filter((n): n is string => Boolean(n));
    return [...new Set(names)];
  }
  return [];
}
