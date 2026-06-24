import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ImageViewerModal from "../components/media/ImageViewerModal";

type ImageViewerContextValue = {
  openImageViewer: (urls: string | string[], initialIndex?: number) => void;
  closeImageViewer: () => void;
};

const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

type ViewerState = {
  urls: string[];
  index: number;
};

export function ImageViewerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewerState | null>(null);

  const openImageViewer = useCallback(
    (urls: string | string[], initialIndex = 0) => {
      const list = (Array.isArray(urls) ? urls : [urls]).filter(
        (url) => typeof url === "string" && url.trim().length > 0,
      );
      if (list.length === 0) return;
      const index = Math.max(0, Math.min(initialIndex, list.length - 1));
      setState({ urls: list, index });
    },
    [],
  );

  const closeImageViewer = useCallback(() => {
    setState(null);
  }, []);

  const value = useMemo(
    () => ({ openImageViewer, closeImageViewer }),
    [openImageViewer, closeImageViewer],
  );

  return (
    <ImageViewerContext.Provider value={value}>
      {children}
      {state ? (
        <ImageViewerModal
          urls={state.urls}
          initialIndex={state.index}
          onClose={closeImageViewer}
        />
      ) : null}
    </ImageViewerContext.Provider>
  );
}

export function useImageViewer(): ImageViewerContextValue {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error("useImageViewer must be used within ImageViewerProvider");
  }
  return context;
}

export function useImageViewerOptional(): ImageViewerContextValue | null {
  return useContext(ImageViewerContext);
}
