import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  ApplicationEntity,
  CreateApplicationDto,
  UpdateApplicationDto,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function parseApplicationEntity(raw: Record<string, unknown>): ApplicationEntity {
  const get = (camel: string, snake: string) =>
    (raw[camel] ?? raw[snake]) as unknown;

  const id = String(get("id", "id") ?? "");
  const postId = (get("postId", "post_id") as string | undefined) ?? undefined;

  const toBool = (v: unknown): boolean | undefined => {
    if (typeof v === "boolean") return v;
    if (v === 1 || v === "1" || v === "true") return true;
    if (v === 0 || v === "0" || v === "false") return false;
    return undefined;
  };

  return {
    id,
    postId,
    userId: (get("userId", "user_id") as string | undefined) ?? undefined,
    includeName: (get("includeName", "include_name") as string | undefined) ?? undefined,
    includeBirth: (get("includeBirth", "include_birth") as string | undefined) ?? undefined,
    includeGender: (get("includeGender", "include_gender") as ApplicationEntity["includeGender"]) ?? undefined,
    includeMajor: (get("includeMajor", "include_major") as string | undefined) ?? undefined,
    includeMajorDetail:
      (get("includeMajorDetail", "include_major_detail") as string | undefined) ?? undefined,
    includeEducation:
      (get("includeEducation", "include_education") as string | undefined) ?? undefined,
    includeCategory:
      (get("includeCategory", "include_category") as string | undefined) ?? undefined,
    includeMusic: (get("includeMusic", "include_music") as string | undefined) ?? undefined,
    includeAddress:
      (get("includeAddress", "include_address") as string | undefined) ?? undefined,
    includeFile: toBool(get("includeFile", "include_file")),
    includeLink: (get("includeLink", "include_link") as string | undefined) ?? undefined,
    includeDepartment:
      (get("includeDepartment", "include_department") as string | undefined) ?? undefined,
    includeCareer: toBool(get("includeCareer", "include_career")),
    includeIntroduce:
      (get("includeIntroduce", "include_introduce") as string | undefined) ?? undefined,
  };
}

/** POST /applications */
export async function createApplication(
  dto: CreateApplicationDto,
): Promise<{ ok: true; data: ApplicationEntity } | { ok: false; status: number; message: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/applications`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return { ok: false, status: res.status, message: text || res.statusText };
    }
    const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    return { ok: true, data: parseApplicationEntity(data) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** GET /applications/post/:postId/me */
export async function getMyApplicationForPost(
  postId: string,
): Promise<
  | { ok: true; data: ApplicationEntity }
  | { ok: false; status: number; notFound?: boolean }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/post/${encodeURIComponent(postId)}/me`,
      { method: "GET", headers },
    );
    if (res.status === 404) {
      return { ok: false, status: 404, notFound: true };
    }
    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, data: parseApplicationEntity(data) };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** PATCH /applications/:id — 지원자 본인, 마감 전·OPEN (README) */
export async function updateApplication(
  id: string,
  dto: UpdateApplicationDto,
): Promise<{ ok: true; data: ApplicationEntity } | { ok: false; status: number; message: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return { ok: false, status: res.status, message: text || res.statusText };
    }
    const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    return { ok: true, data: parseApplicationEntity(data) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** GET /applications/post/:postId — 해당 공고 지원 목록 (작성자만, README) */
export async function getApplicationsForPost(
  postId: string,
): Promise<
  | { ok: true; data: ApplicationEntity[] }
  | { ok: false; status: number; message?: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/post/${encodeURIComponent(postId)}`,
      { method: "GET", headers },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, message: text };
    }
    const data = (await res.json()) as unknown;
    const arr = Array.isArray(data) ? data : [];
    return {
      ok: true,
      data: arr.map((row) => parseApplicationEntity(row as Record<string, unknown>)),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** GET /applications/:id — 단건 (지원자 또는 공고 작성자, README) */
export async function getApplicationById(
  id: string,
): Promise<
  | { ok: true; data: ApplicationEntity }
  | { ok: false; status: number; message?: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, message: text };
    }
    const data = (await res.json()) as Record<string, unknown>;
    return { ok: true, data: parseApplicationEntity(data) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
