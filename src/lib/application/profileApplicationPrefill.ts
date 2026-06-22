import type { ProfileResponseDto } from "../apis/portfolio/types";

/** ApplicationScreen 전공 드롭다운과 동일한 value 목록 */
const MAJOR_OPTION_VALUES = [
  "건반악기",
  "현악",
  "성악",
  "작곡",
  "무용",
  "실용",
] as const;

export type ApplicationPrefill = {
  name: string;
  birthYear: string;
  majorValue: string;
  schoolName: string;
  grade: string;
};

export function matchMajorToApplicationDropdown(
  majorLabel: string | undefined,
  majorDetail: string | undefined,
): string {
  const haystack = `${majorLabel ?? ""} ${majorDetail ?? ""}`;
  for (const v of MAJOR_OPTION_VALUES) {
    if (haystack.includes(v)) return v;
  }
  return "";
}

/**
 * 내 프로필(GET /users/profile/my) 응답으로 지원서 폼에 맞는 값만 추출.
 * 폼마다 필드가 다를 수 있어, 없는 항목은 빈 문자열.
 */
export function deriveApplicationPrefillFromProfile(
  p: ProfileResponseDto,
): ApplicationPrefill {
  const raw = p as ProfileResponseDto & Record<string, unknown>;

  const name = (p.activityName?.trim() || p.name?.trim() || "").trim();

  let birthYear = "";
  const by = raw.birthYear ?? raw.birth_year;
  if (typeof by === "number" && by >= 1900 && by <= 2100) {
    birthYear = String(Math.floor(by));
  } else if (typeof by === "string") {
    const m = by.trim().match(/^(\d{4})/);
    if (m) birthYear = m[1];
  }
  if (!birthYear) {
    const bd = raw.birthDate ?? raw.birth_date;
    if (typeof bd === "string" && bd.trim()) {
      const d = new Date(bd);
      if (!Number.isNaN(d.getTime())) birthYear = String(d.getFullYear());
    }
  }

  let majorStr = "";
  if (typeof p.major === "string") {
    majorStr = p.major;
  } else if (p.major && typeof p.major === "object" && p.major !== null) {
    majorStr = String(
      (p.major as { name?: string }).name ??
        (p.major as { label?: string }).label ??
        "",
    );
  }
  const majorDetail =
    typeof p.majorDetail === "string" ? p.majorDetail : String(raw.majorDetail ?? "");
  const majorValue = matchMajorToApplicationDropdown(majorStr, majorDetail);

  let schoolName = "";
  const educations =
    (Array.isArray(raw.educations) ? raw.educations : null) ??
    p.educationEntries ??
    [];
  if (Array.isArray(educations) && educations.length > 0) {
    const e0 = educations[0] as Record<string, unknown>;
    schoolName = String(e0.description ?? "").trim();
  }
  if (!schoolName && p.education && typeof p.education === "string") {
    schoolName = p.education.split(/[\n\r]/)[0]?.trim() ?? "";
  }

  return {
    name,
    birthYear,
    majorValue,
    schoolName,
    grade: "",
  };
}
