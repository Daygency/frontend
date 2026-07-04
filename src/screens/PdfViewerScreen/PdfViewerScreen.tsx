import { useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { RootRoutes } from "../../navigations/routes";
import { GRAY } from "../../color";
import styles from "./styles";

export type PdfViewerParams = {
  url: string;
  title?: string;
};

type PdfViewerRouteProp = RouteProp<
  { [RootRoutes.PDF_VIEWER]: PdfViewerParams },
  typeof RootRoutes.PDF_VIEWER
>;

const buildDocumentViewerUrl = (url: string) =>
  `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;

const isPdfUrl = (url: string, title?: string) => {
  const cleanUrl = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  const cleanTitle = title?.toLowerCase() ?? "";
  return cleanUrl.endsWith(".pdf") || cleanTitle.endsWith(".pdf");
};

const PdfViewerScreen = () => {
  const route = useRoute<PdfViewerRouteProp>();
  const url = route.params?.url?.trim() ?? "";
  const title = route.params?.title;
  const [loading, setLoading] = useState(true);
  const [useGoogleViewer, setUseGoogleViewer] = useState(
    () => !isPdfUrl(url, title),
  );
  const viewerUrl = useMemo(
    () => (url ? (useGoogleViewer ? buildDocumentViewerUrl(url) : url) : ""),
    [url, useGoogleViewer],
  );

  if (!viewerUrl) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>파일을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webView}
        startInLoadingState
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          if (!useGoogleViewer) {
            setLoading(true);
            setUseGoogleViewer(true);
            return;
          }
          setLoading(false);
        }}
      />
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={GRAY.DARK} />
        </View>
      ) : null}
    </View>
  );
};

export default PdfViewerScreen;
