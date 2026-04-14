import { API_BASE, MAJOR_LIST_PATH } from "../api";

export type Major = {
  majorId: string;
  name: string;
};

function normalizeMajorRow(raw: unknown): Major | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const majorId = String(
    r.majorId ?? r.major_id ?? r.id ?? "",
  ).trim();
  const name = String(r.name ?? r.label ?? "").trim();
  if (!majorId) return null;
  return { majorId, name: name || majorId };
}

function extractRows(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const o = data as Record<string, unknown>;
  if (Array.isArray(o.items)) return o.items;
  if (Array.isArray(o.majors)) return o.majors;
  if (Array.isArray(o.result)) return o.result;
  if (Array.isArray(o.data)) return o.data;
  const nested = o.data;
  if (nested && typeof nested === "object") {
    const n = nested as Record<string, unknown>;
    if (Array.isArray(n.items)) return n.items;
    if (Array.isArray(n.majors)) return n.majors;
  }
  return [];
}

function parseMajorsBody(data: unknown): Major[] {
  return extractRows(data)
    .map(normalizeMajorRow)
    .filter((m): m is Major => m !== null);
}

/** Swagger `/api` 프리픽스만 쓰는 서버에서 `API_BASE`에 `/api`가 빠진 경우 보완 */
function candidateApiBases(): string[] {
  const b = API_BASE.replace(/\/$/, "");
  if (b.endsWith("/api")) return [b];
  const withApi = `${b}/api`;
  return [b, withApi].filter((x, i, a) => a.indexOf(x) === i);
}

function normalizePath(p: string): string {
  return p.startsWith("/") ? p : `/${p}`;
}

/**
 * README: `GET /major` — 인증 불필요, `majorId`·`name` 배열, 이름 오름차순(서버 기준, 클라이언트에서도 정렬).
 * Swagger `/api` → majors 태그 → `EXPO_PUBLIC_API_BASE`에 `/api` 포함 권장.
 */
export async function getMajors(): Promise<Major[]> {
  const primary = normalizePath(MAJOR_LIST_PATH);
  const altPath = primary === "/majors" ? "/major" : "/majors";
  const paths = [primary, altPath].filter((p, i, a) => a.indexOf(p) === i);

  for (const base of candidateApiBases()) {
    for (const path of paths) {
      const url = `${base}${path}`;
      try {
        // README: 인증 불필요 — Bearer(만료)로 401 나는 것 방지
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (res.status === 404) continue;
        if (!res.ok) {
          console.warn(`[getMajors] ${res.status} ${url}`);
          continue;
        }
        const data = await res.json();
        const parsed = parseMajorsBody(data);
        parsed.sort((a, b) =>
          a.name.localeCompare(b.name, "ko", { sensitivity: "base" }),
        );
        return parsed;
      } catch (e) {
        console.warn("[getMajors] 에러:", url, e);
      }
    }
  }
  return [];
}
