import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../api";

const CATEGORY_CACHE_KEY = "@daygency_announcement_categories";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

export type AnnouncementCategory = {
  categoryId: string;
  name: string;
};

type CategoryCache = {
  data: AnnouncementCategory[];
  fetchedAt: number;
};

async function fetchCategoriesFromApi(): Promise<AnnouncementCategory[]> {
  const res = await fetch(`${API_BASE}/announcement/categories`, {
    method: "GET",
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

async function getCachedCategories(): Promise<AnnouncementCategory[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CATEGORY_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CategoryCache;
    if (!cached?.data || !Array.isArray(cached.data)) return null;
    const age = Date.now() - (cached.fetchedAt ?? 0);
    if (age > CACHE_TTL_MS) return null;
    return cached.data;
  } catch {
    return null;
  }
}

async function saveCategoriesCache(data: AnnouncementCategory[]): Promise<void> {
  try {
    const cache: CategoryCache = { data, fetchedAt: Date.now() };
    await AsyncStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // 캐시 저장 실패 시 무시
  }
}

/**
 * 공고 유형 목록 조회 (api-readme: GET /announcement/categories)
 * - 유효한 캐시가 있으면 즉시 반환 (등록페이지 진입 시 API 호출 불필요)
 * - 캐시가 없거나 만료(24h)되면 API 호출 후 저장
 */
export async function getAnnouncementCategories(): Promise<
  AnnouncementCategory[]
> {
  const cached = await getCachedCategories();
  if (cached && cached.length > 0) {
    // 백그라운드에서 최신 데이터로 캐시 갱신 (stale-while-revalidate)
    fetchCategoriesFromApi()
      .then((fresh) => {
        if (fresh.length > 0) saveCategoriesCache(fresh);
      })
      .catch(() => {});
    return cached;
  }

  try {
    const data = await fetchCategoriesFromApi();
    if (data.length > 0) await saveCategoriesCache(data);
    return data;
  } catch (e) {
    console.warn("[getAnnouncementCategories] 에러:", e);
    return [];
  }
}
