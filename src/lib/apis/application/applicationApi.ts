import AsyncStorage from "@react-native-async-storage/async-storage";
import { pickProfileImageUrlDeep } from "../../chat/peerImageFields";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  ApplicationEntity,
  ApplicationApplicantSummary,
  ApplicationReviewStatus,
  CreateApplicationDto,
  UpdateApplicationDto,
  UpdateApplicationStatusDto,
} from "./types";
import type {
  ApplicationSnapshotAward,
  ApplicationSnapshotCareer,
  ApplicationSnapshotCertificate,
  ApplicationSnapshotEducation,
  ApplicationSnapshotFile,
} from "./snapshot.types";

/** Nest 400 응답 본문이 JSON 문자열일 때 message 만 뽑아 알림에 쓰기 */
function formatApplicationApiError(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t) return "요청에 실패했습니다.";
  try {
    const o = JSON.parse(t) as { message?: unknown };
    if (typeof o.message === "string" && o.message) return o.message;
    if (Array.isArray(o.message) && o.message.length) {
      return o.message.map(String).join("\n");
    }
  } catch {
    /* plain text */
  }
  return t.length > 500 ? `${t.slice(0, 500)}...` : t;
}

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function parseReviewStatus(raw: unknown): ApplicationReviewStatus | undefined {
  if (
    raw === "SUBMITTED" ||
    raw === "DOCUMENT_REVIEW" ||
    raw === "ACCEPTED" ||
    raw === "REJECTED"
  ) {
    return raw;
  }
  return undefined;
}

function parseSnapshotFiles(
  arr: unknown,
): ApplicationSnapshotFile[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: ApplicationSnapshotFile[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const fileId = r.fileId ?? r.file_id;
    out.push({
      fileId: fileId != null ? String(fileId) : undefined,
      url: typeof r.url === "string" ? r.url : undefined,
      originalName:
        typeof r.originalName === "string"
          ? r.originalName
          : typeof r.original_name === "string"
            ? r.original_name
            : undefined,
    });
  }
  return out.length ? out : undefined;
}

function parseSnapshotEducations(
  arr: unknown,
): ApplicationSnapshotEducation[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: ApplicationSnapshotEducation[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.description !== "string") continue;
    const startedAt = String(r.startedAt ?? r.started_at ?? "");
    const endedRaw = r.endedAt ?? r.ended_at;
    const endedAt =
      endedRaw === null || endedRaw === undefined ? null : String(endedRaw);
    out.push({ description: r.description, startedAt, endedAt });
  }
  return out.length ? out : undefined;
}

function parseSnapshotCareers(
  arr: unknown,
): ApplicationSnapshotCareer[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: ApplicationSnapshotCareer[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.description !== "string") continue;
    out.push({
      description: r.description,
      startedAt: String(r.startedAt ?? r.started_at ?? ""),
      endedAt: String(r.endedAt ?? r.ended_at ?? ""),
      organization:
        typeof r.organization === "string" ? r.organization : undefined,
    });
  }
  return out.length ? out : undefined;
}

function parseSnapshotAwards(
  arr: unknown,
): ApplicationSnapshotAward[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: ApplicationSnapshotAward[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.description !== "string") continue;
    const awardedRaw = r.awardedAt ?? r.awarded_at;
    const awardedAt =
      awardedRaw === null || awardedRaw === undefined
        ? null
        : String(awardedRaw);
    out.push({
      description: r.description,
      awardedAt,
      organization:
        typeof r.organization === "string" ? r.organization : undefined,
    });
  }
  return out.length ? out : undefined;
}

function parseSnapshotCertificates(
  arr: unknown,
): ApplicationSnapshotCertificate[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: ApplicationSnapshotCertificate[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (typeof r.description !== "string") continue;
    const obtainedRaw = r.obtainedAt ?? r.obtained_at;
    const obtainedAt =
      obtainedRaw === null || obtainedRaw === undefined
        ? null
        : String(obtainedRaw);
    out.push({
      description: r.description,
      obtainedAt,
      organization:
        typeof r.organization === "string" ? r.organization : undefined,
    });
  }
  return out.length ? out : undefined;
}

function pickScalarString(
  raw: Record<string, unknown>,
  primary: [string, string],
  legacy?: [string, string],
): string | undefined {
  const [c, s] = primary;
  const a = raw[c];
  if (typeof a === "string") return a;
  const b = raw[s];
  if (typeof b === "string") return b;
  if (legacy) {
    const [lc, ls] = legacy;
    const x = raw[lc];
    if (typeof x === "string") return x;
    const y = raw[ls];
    if (typeof y === "string") return y;
  }
  return undefined;
}

function parseGenderField(raw: unknown): ApplicationEntity["gender"] {
  if (raw === "FEMALE" || raw === "MALE" || raw === "NONE") return raw;
  return undefined;
}

function parseApplicantSummary(raw: unknown): ApplicationApplicantSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const userId = String(r.userId ?? r.user_id ?? "").trim();
  if (!userId) return undefined;
  const nameRaw = r.name;
  const name =
    typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : null;
  const activityName = String(
    r.activityName ?? r.activity_name ?? "",
  ).trim();
  const profileImgUrl = pickProfileImageUrlDeep(r);
  return {
    userId,
    name,
    ...(activityName ? { activityName } : {}),
    ...(profileImgUrl ? { profileImgUrl } : {}),
  };
}

function parseApplicationEntity(
  raw: Record<string, unknown>,
): ApplicationEntity {
  const get = (camel: string, snake: string) =>
    (raw[camel] ?? raw[snake]) as unknown;

  const id = String(get("id", "id") ?? "");
  const postId = (get("postId", "post_id") as string | undefined) ?? undefined;

  const name = pickScalarString(
    raw,
    ["name", "name"],
    ["includeName", "include_name"],
  );
  const birth = pickScalarString(
    raw,
    ["birth", "birth"],
    ["includeBirth", "include_birth"],
  );
  const gender =
    parseGenderField(get("gender", "gender")) ??
    parseGenderField(get("includeGender", "include_gender"));
  const major = pickScalarString(
    raw,
    ["major", "major"],
    ["includeMajor", "include_major"],
  );
  const majorDetail = pickScalarString(
    raw,
    ["majorDetail", "major_detail"],
    ["includeMajorDetail", "include_major_detail"],
  );
  const category = pickScalarString(
    raw,
    ["category", "category"],
    ["includeCategory", "include_category"],
  );
  const music = pickScalarString(
    raw,
    ["music", "music"],
    ["includeMusic", "include_music"],
  );
  const address = pickScalarString(
    raw,
    ["address", "address"],
    ["includeAddress", "include_address"],
  );
  const link = pickScalarString(
    raw,
    ["link", "link"],
    ["includeLink", "include_link"],
  );
  const department = pickScalarString(
    raw,
    ["department", "department"],
    ["includeDepartment", "include_department"],
  );
  const introduce = pickScalarString(
    raw,
    ["introduce", "introduce"],
    ["includeIntroduce", "include_introduce"],
  );

  const file = parseSnapshotFiles(get("file", "file"));
  let education = parseSnapshotEducations(get("education", "education"));
  if (!education?.length) {
    const legacyEd = pickScalarString(raw, [
      "includeEducation",
      "include_education",
    ]);
    if (legacyEd?.trim()) {
      education = [
        {
          description: legacyEd.trim(),
          startedAt: "1970-01-01T00:00:00.000Z",
          endedAt: null,
        },
      ];
    }
  }
  const career = parseSnapshotCareers(get("career", "career"));
  const award = parseSnapshotAwards(get("award", "award"));
  const certificate = parseSnapshotCertificates(
    get("certificate", "certificate"),
  );

  const createdAtRaw = get("createdAt", "created_at");
  const canceledAtRaw = get("canceledAt", "canceled_at");
  const deletedAtRaw = get("deletedAt", "deleted_at");

  const userIdRaw =
    (get("userId", "user_id") as string | undefined) ??
    (get("applicantUserId", "applicant_user_id") as string | undefined);
  const applicant =
    parseApplicantSummary(get("applicant", "applicant")) ??
    parseApplicantSummary(get("user", "user"));
  const profileImgUrl =
    applicant?.profileImgUrl ?? pickProfileImageUrlDeep(get("user", "user"));

  return {
    id,
    postId,
    userId: userIdRaw ?? applicant?.userId ?? undefined,
    status: parseReviewStatus(get("status", "status")),
    ...(name !== undefined ? { name } : {}),
    ...(birth !== undefined ? { birth } : {}),
    ...(gender !== undefined ? { gender } : {}),
    ...(major !== undefined ? { major } : {}),
    ...(majorDetail !== undefined ? { majorDetail } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(music !== undefined ? { music } : {}),
    ...(address !== undefined ? { address } : {}),
    ...(link !== undefined ? { link } : {}),
    ...(department !== undefined ? { department } : {}),
    ...(introduce !== undefined ? { introduce } : {}),
    ...(typeof createdAtRaw === "string" ? { createdAt: createdAtRaw } : {}),
    ...(canceledAtRaw === null || typeof canceledAtRaw === "string"
      ? { canceledAt: canceledAtRaw as string | null }
      : {}),
    ...(deletedAtRaw === null || typeof deletedAtRaw === "string"
      ? { deletedAt: deletedAtRaw as string | null }
      : {}),
    ...(file ? { file } : {}),
    ...(education ? { education } : {}),
    ...(career ? { career } : {}),
    ...(award ? { award } : {}),
    ...(certificate ? { certificate } : {}),
    ...(applicant ? { applicant } : {}),
    ...(applicant?.activityName ? { activityName: applicant.activityName } : {}),
    ...(profileImgUrl ? { profileImgUrl } : {}),
  };
}

/** POST /applications */
export async function createApplication(
  dto: CreateApplicationDto,
): Promise<
  | { ok: true; data: ApplicationEntity }
  | { ok: false; status: number; message: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/applications`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: formatApplicationApiError(text || res.statusText),
      };
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
): Promise<
  | { ok: true; data: ApplicationEntity }
  | { ok: false; status: number; message: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(dto),
      },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: formatApplicationApiError(text || res.statusText),
      };
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
  params?: { cursor?: string; limit?: number },
): Promise<
  | { ok: true; data: ApplicationEntity[]; nextCursor: string | null; hasMore: boolean }
  | { ok: false; status: number; message?: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const q = new URLSearchParams();
    if (params?.cursor) q.set("cursor", params.cursor);
    if (params?.limit != null) q.set("limit", String(params.limit));
    const query = q.toString();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/post/${encodeURIComponent(postId)}${query ? `?${query}` : ""}`,
      { method: "GET", headers },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, message: text };
    }
    const data = (await res.json()) as {
      items?: unknown[];
      nextCursor?: unknown;
      hasMore?: unknown;
    };
    const arr = Array.isArray(data.items) ? data.items : [];
    return {
      ok: true,
      data: arr.map((row) =>
        parseApplicationEntity(row as Record<string, unknown>),
      ),
      nextCursor: typeof data.nextCursor === "string" ? data.nextCursor : null,
      hasMore: Boolean(data.hasMore),
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
    const res = await fetchWithAuth(
      `${API_BASE}/applications/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers,
      },
    );
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

/** PATCH /applications/:id/status — 심사 상태 (공고 작성자만, README) */
export async function updateApplicationStatus(
  id: string,
  dto: UpdateApplicationStatusDto,
): Promise<
  | { ok: true; data: ApplicationEntity }
  | { ok: false; status: number; message: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(dto),
      },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return { ok: false, status: res.status, message: text || res.statusText };
    }
    let data: Record<string, unknown>;
    try {
      data = text.trim()
        ? (JSON.parse(text) as Record<string, unknown>)
        : { id };
    } catch {
      data = { id };
    }
    if (data.id == null || data.id === "") data.id = id;
    return { ok: true, data: parseApplicationEntity(data) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}

/** DELETE /applications/:id — 내 지원 소프트 삭제 (지원자 본인, README · 204) */
export async function deleteApplication(
  id: string,
): Promise<{ ok: true } | { ok: false; status: number; message?: string }> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(
      `${API_BASE}/applications/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (res.status === 204) {
      return { ok: true };
    }
    const text = await res.text().catch(() => "");
    return { ok: false, status: res.status, message: text || res.statusText };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
