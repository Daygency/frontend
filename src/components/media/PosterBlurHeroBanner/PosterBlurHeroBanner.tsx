import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useImageViewerOptional } from "../../../contexts/ImageViewerContext";

const BANNER_HEIGHT = 168;
const FOREGROUND_MAX_HEIGHT = 152;
const HORIZONTAL_PADDING = 12;

type ImageDimensions = { width: number; height: number };

type PosterBlurHeroBannerProps = {
  imageUrl: string;
  /** 탭 시 뷰어에 넘길 전체 URL (미지정 시 imageUrl만) */
  viewerUrls?: string[];
  style?: StyleProp<ViewStyle>;
};

function fitForegroundSize(imgW: number, imgH: number) {
  if (imgW <= 0 || imgH <= 0) {
    return { width: 96, height: FOREGROUND_MAX_HEIGHT };
  }
  const scale = Math.min(FOREGROUND_MAX_HEIGHT / imgH, 1);
  return {
    width: Math.round(imgW * scale),
    height: Math.round(imgH * scale),
  };
}

const PosterBlurHeroBanner = ({
  imageUrl,
  viewerUrls,
  style,
}: PosterBlurHeroBannerProps) => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const imageViewer = useImageViewerOptional();

  useEffect(() => {
    let cancelled = false;
    setDimensions(null);
    Image.getSize(
      imageUrl,
      (width, height) => {
        if (!cancelled && width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const foregroundSize = dimensions
    ? fitForegroundSize(dimensions.width, dimensions.height)
    : { width: 96, height: FOREGROUND_MAX_HEIGHT };

  const openViewer = () => {
    const urls = viewerUrls?.length ? viewerUrls : [imageUrl];
    const index = Math.max(0, urls.indexOf(imageUrl));
    imageViewer?.openImageViewer(urls, index);
  };

  const foreground = (
    <Image
      source={{ uri: imageUrl }}
      style={[
        styles.foregroundImage,
        { width: foregroundSize.width, height: foregroundSize.height },
      ]}
      resizeMode="contain"
    />
  );

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.bannerBg} pointerEvents="none">
        <Image
          source={{ uri: imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          blurRadius={28}
        />
        <View style={styles.bannerOverlay} />
      </View>

      <View style={styles.foregroundRow}>
        {imageViewer ? (
          <Pressable
            onPress={openViewer}
            accessibilityRole="image"
            style={styles.foregroundPressable}
          >
            {foreground}
          </Pressable>
        ) : (
          foreground
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    height: BANNER_HEIGHT,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#1a1a1a",
  },
  bannerBg: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  foregroundRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: HORIZONTAL_PADDING,
  },
  foregroundPressable: {
    borderRadius: 4,
    overflow: "hidden",
  },
  foregroundImage: {
    borderRadius: 4,
  },
});

export default PosterBlurHeroBanner;
