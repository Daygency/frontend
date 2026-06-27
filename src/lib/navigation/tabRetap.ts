type TabRetapHandler = () => void;

/** 서브탭 전환 전 맨 위로 올릴지 판단하는 스크롤 임계값(px) */
export const TAB_RESCROLL_THRESHOLD = 8;

const handlers = new Map<string, TabRetapHandler>();

export function registerTabRetapHandler(
  tabRouteName: string,
  handler: TabRetapHandler,
): () => void {
  handlers.set(tabRouteName, handler);
  return () => {
    const current = handlers.get(tabRouteName);
    if (current === handler) {
      handlers.delete(tabRouteName);
    }
  };
}

export function fireTabRetap(tabRouteName: string): void {
  handlers.get(tabRouteName)?.();
}

export function createSubTabRetapHandler(options: {
  isScrolledDown: () => boolean;
  scrollToTop: () => void;
  toggleSubTab: () => void;
}): TabRetapHandler {
  return () => {
    if (options.isScrolledDown()) {
      options.scrollToTop();
      return;
    }
    options.toggleSubTab();
  };
}
