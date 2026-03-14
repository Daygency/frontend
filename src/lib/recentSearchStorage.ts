import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCH_KEY = "recentSearch";
const MAX_RECENT = 10;

export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = async (term: string): Promise<void> => {
  if (!term?.trim()) return;
  const trimmed = term.trim();
  const existing = await getRecentSearches();
  const filtered = existing.filter((t) => t !== trimmed);
  const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
  await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
};

export const removeRecentSearch = async (term: string): Promise<void> => {
  const existing = await getRecentSearches();
  const updated = existing.filter((t) => t !== term);
  await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
};

export const clearRecentSearches = async (): Promise<void> => {
  await AsyncStorage.removeItem(RECENT_SEARCH_KEY);
};
