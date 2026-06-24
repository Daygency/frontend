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
 * 모집 전공 칩 선택값 → API용 UUID 배열
 * - value(majorId) 우선, label(이름)로도 매칭
 */
export function buildMajorIdsForSubmit(
  selectedKeys: string[],
  options: { label: string; value: string }[],
): string[] {
  const ids: string[] = [];
  for (const key of selectedKeys) {
    const trimmed = key.trim();
    if (!trimmed) continue;
    const opt =
      options.find((m) => m.value === trimmed) ??
      options.find((m) => m.label === trimmed) ??
      options.find((m) => (m.value || m.label) === trimmed);
    if (!opt) continue;
    const v = String(opt.value ?? "").trim();
    if (v) ids.push(v);
  }
  return [...new Set(ids)];
}

/** 칩 선택 상태용 키 — API 로드 후에는 majorId(value)로 통일 */
export function normalizeMajorSelectionKeys(
  selectedKeys: string[],
  options: { label: string; value: string }[],
): string[] {
  const hasApiIds = options.some((o) => o.value.trim());
  if (!hasApiIds) return selectedKeys;
  const normalized = selectedKeys
    .map((key) => {
      const trimmed = key.trim();
      if (!trimmed) return "";
      const byValue = options.find((o) => o.value === trimmed);
      if (byValue?.value) return byValue.value;
      const byLabel = options.find((o) => o.label === trimmed);
      if (byLabel?.value) return byLabel.value;
      return trimmed;
    })
    .filter(Boolean);
  return [...new Set(normalized)];
}

export function majorOptionKey(opt: { label: string; value: string }): string {
  return opt.value.trim() || opt.label;
}

export function isMajorOptionSelected(
  selectedKeys: string[],
  opt: { label: string; value: string },
): boolean {
  const key = majorOptionKey(opt);
  return selectedKeys.includes(key) || selectedKeys.includes(opt.label);
}

export function resolveRecruitmentMajorDisplayNames(
  item: {
    majorIds?: string[];
    majors?: { majorId: string; name: string }[];
  },
  catalog: { name: string; majorId: string }[],
): string[] {
  if (item.majors?.length) {
    const names = item.majors
      .map(
        (m) =>
          m.name?.trim() ||
          catalog.find((c) => c.majorId === m.majorId)?.name ||
          "",
      )
      .filter(Boolean);
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
