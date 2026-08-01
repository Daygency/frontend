import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AnnouncementListItem,
  AnnouncementListParams,
  AnnouncementListResponse,
} from "../apis/announcement/types";

const PAGE_LIMIT = 8;

type TabData = {
  items: AnnouncementListItem[];
  cursor: string | null;
  hasMore: boolean;
  loadedOnce: boolean;
};

function emptyTabData(): TabData {
  return { items: [], cursor: null, hasMore: true, loadedOnce: false };
}

/**
 * 탭(상태 필터)별로 커서를 독립적으로 유지하는 8개 단위 무한스크롤 훅.
 * 한 번 로드한 탭은 데이터를 유지하고, 다시 전환해도 재조회하지 않는다.
 */
export function useCursorAnnouncementTabs<Tab extends string>(
  tabs: readonly Tab[],
  activeTab: Tab,
  buildParams: (tab: Tab) => AnnouncementListParams,
  fetchPage: (
    params: AnnouncementListParams,
  ) => Promise<AnnouncementListResponse | null>,
) {
  const [tabData, setTabData] = useState<Record<Tab, TabData>>(() => {
    const init = {} as Record<Tab, TabData>;
    tabs.forEach((tab) => {
      init[tab] = emptyTabData();
    });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const seqRef = useRef(0);

  const load = useCallback(
    async (tab: Tab, options?: { cursor?: string; refresh?: boolean }) => {
      const isLoadMore = Boolean(options?.cursor);
      const isRefresh = Boolean(options?.refresh);
      const seq = ++seqRef.current;

      if (isLoadMore) setLoadingMore(true);
      else if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await fetchPage({
          ...buildParams(tab),
          cursor: options?.cursor,
          limit: PAGE_LIMIT,
        });
        if (seq !== seqRef.current) return;
        setTabData((prev) => ({
          ...prev,
          [tab]: {
            items: isLoadMore
              ? [...prev[tab].items, ...(res?.items ?? [])]
              : res?.items ?? [],
            cursor: res?.nextCursor ?? null,
            hasMore: res?.hasMore ?? false,
            loadedOnce: true,
          },
        }));
      } finally {
        if (seq === seqRef.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [buildParams, fetchPage],
  );

  useEffect(() => {
    if (!tabData[activeTab].loadedOnce) {
      load(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const current = tabData[activeTab];

  const loadMore = useCallback(() => {
    if (
      loading ||
      loadingMore ||
      refreshing ||
      !current.hasMore ||
      !current.cursor
    ) {
      return;
    }
    load(activeTab, { cursor: current.cursor });
  }, [
    activeTab,
    current.cursor,
    current.hasMore,
    load,
    loading,
    loadingMore,
    refreshing,
  ]);

  const onRefresh = useCallback(async () => {
    await load(activeTab, { refresh: true });
  }, [activeTab, load]);

  return {
    items: current.items,
    loading: loading && current.items.length === 0,
    loadingMore,
    hasMore: current.hasMore,
    refreshing,
    loadMore,
    onRefresh,
  };
}
