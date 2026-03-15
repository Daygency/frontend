import { API_BASE } from "../api";

export type Major = {
  majorId: string;
  name: string;
};

/**
 * 전공 목록 조회 (major 테이블 참조)
 * API 엔드포인트는 백엔드 스펙에 맞게 조정 필요
 */
export async function getMajors(): Promise<Major[]> {
  try {
    const res = await fetch(`${API_BASE}/major`, { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  } catch (e) {
    console.warn("[getMajors] 에러:", e);
    return [];
  }
}
