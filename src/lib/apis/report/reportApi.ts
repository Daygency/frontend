import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE, AUTH_TOKEN_KEY } from "../api";
import { fetchWithAuth } from "../fetchWithAuth";
import type {
  CreateReportBody,
  CreateReportResponse,
  ReportCategoriesResponse,
  ReportCategory,
} from "./types";

async function getAuthHeadersRequired(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("인증이 필요합니다.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function normalizeReportCategoriesResponse(
  raw: unknown,
): ReportCategoriesResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const cats = r.categories;
  if (!Array.isArray(cats)) return null;
  const categories: ReportCategoriesResponse["categories"] = [];
  for (const item of cats) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const value = o.value;
    const labelKo = o.labelKo ?? o.label_ko ?? o.label;
    if (typeof value !== "string" || typeof labelKo !== "string") continue;
    categories.push({
      value: value as ReportCategory,
      labelKo: String(labelKo).trim(),
    });
  }
  return categories.length > 0 ? { categories } : null;
}

/** GET /reports/categories — 인증 불필요 (README) */
export async function getReportCategories(): Promise<ReportCategoriesResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/reports/categories`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.warn(
        "[getReportCategories] 실패:",
        res.status,
        text?.slice?.(0, 200),
      );
      return null;
    }
    if (!text.trim()) return null;
    try {
      const raw = JSON.parse(text) as unknown;
      return normalizeReportCategoriesResponse(raw);
    } catch {
      return null;
    }
  } catch (e) {
    console.warn("[getReportCategories] 네트워크 에러:", e);
    return null;
  }
}

function parseErrorMessage(text: string): string {
  const t = text?.trim() ?? "";
  if (!t) return "";
  try {
    const o = JSON.parse(t) as { message?: unknown };
    if (typeof o.message === "string") return o.message;
  } catch {
    /* plain text */
  }
  return t.length > 400 ? `${t.slice(0, 400)}...` : t;
}

export async function createReport(
  body: CreateReportBody,
): Promise<
  | { ok: true; data: CreateReportResponse }
  | { ok: false; status: number; message: string }
> {
  try {
    const headers = await getAuthHeadersRequired();
    const res = await fetchWithAuth(`${API_BASE}/reports`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: parseErrorMessage(text) || "신고 접수에 실패했습니다.",
      };
    }
    if (!text.trim()) {
      return {
        ok: true,
        data: {
          ok: true,
          reportedUserId: body.reportedUserId,
          totalReportsAgainstUser: 0,
        },
      };
    }
    try {
      const data = JSON.parse(text) as CreateReportResponse;
      return { ok: true, data };
    } catch {
      return {
        ok: true,
        data: {
          ok: true,
          reportedUserId: body.reportedUserId,
          totalReportsAgainstUser: 0,
        },
      };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg };
  }
}
