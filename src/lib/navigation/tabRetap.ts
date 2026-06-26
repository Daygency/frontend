type TabRetapHandler = () => void;

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
