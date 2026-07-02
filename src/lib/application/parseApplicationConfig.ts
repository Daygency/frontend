import type { ApplicationConfig } from "../apis/announcement/types";

const DEFAULT: ApplicationConfig = {
  includeName: false,
  includeBirth: false,
  includeGender: false,
  includeMajor: false,
  includeMajorDetail: false,
  includeEducation: false,
  includeCategory: false,
  includeMusic: false,
  includeFile: false,
  includeLink: false,
  includeCareer: false,
  includeIntroduce: false,
};

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (v === 1 || v === "1" || v === "true") return true;
  return false;
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

/**
 * README: `GET /announcement/:id` 에서 지원서 양식이 없으면 `applicationConfig` 가 `null` 일 수 있음.
 */
export function detailHasExplicitNullApplicationConfig(
  detail: Record<string, unknown> | null | undefined,
): boolean {
  if (!detail) return false;
  return detail.applicationConfig === null || detail.application_config === null;
}

/**
 * 공고 상세 응답 어디에 붙어 있든 `applicationConfig` 원본 객체(또는 JSON 문자열)를 찾는다.
 * (백엔드에 따라 `data`, `announcement` 안에만 있거나 snake_case 전용으로 올 수 있음)
 */
export function extractApplicationConfigRaw(
  detail: Record<string, unknown> | null | undefined,
): unknown {
  if (!detail || typeof detail !== "object") return undefined;

  const candidates: unknown[] = [
    detail.applicationConfig,
    detail.application_config,
    (detail.data as Record<string, unknown> | undefined)?.applicationConfig,
    (detail.data as Record<string, unknown> | undefined)?.application_config,
    (detail.announcement as Record<string, unknown> | undefined)?.applicationConfig,
    (detail.announcement as Record<string, unknown> | undefined)?.application_config,
    (detail.post as Record<string, unknown> | undefined)?.applicationConfig,
    (detail.post as Record<string, unknown> | undefined)?.application_config,
  ];
  for (const c of candidates) {
    if (c != null && c !== "") return c;
  }

  for (const v of Object.values(detail)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const o = v as Record<string, unknown>;
    if (Object.keys(o).some((k) => /^include/i.test(k))) {
      return v;
    }
  }
  return undefined;
}

/**
 * 공고 상세 API의 `applicationConfig` / `application_config` 객체를 ApplicationConfig 로 정규화.
 * 서버가 snake_case(`include_name` 등)만 보내도, 응답 객체의 **모든 키**를 읽어 매칭한다.
 */
export function parseApplicationConfig(raw: unknown): ApplicationConfig {
  const c = { ...DEFAULT };
  let o: Record<string, unknown> | null = null;

  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return c;
    try {
      const p = JSON.parse(t) as unknown;
      if (p && typeof p === "object" && !Array.isArray(p)) {
        o = p as Record<string, unknown>;
      } else {
        return c;
      }
    } catch {
      return c;
    }
  } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    o = raw as Record<string, unknown>;
  } else {
    return c;
  }

  for (const key of Object.keys(o)) {
    const camel = key.includes("_") ? snakeToCamelKey(key) : key;
    if (camel in DEFAULT) {
      c[camel as keyof ApplicationConfig] = toBool(o[key]);
    }
  }
  return c;
}

export function hasAnyApplicationField(config: ApplicationConfig): boolean {
  return (Object.values(config) as boolean[]).some(Boolean);
}
