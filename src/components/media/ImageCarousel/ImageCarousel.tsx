import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageResizeMode,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import styles from "./styles";
import { GRAY } from "../../../color";
import { useImageViewerOptional } from "../../../contexts/ImageViewerContext";

export type CarouselBannerItem = {
  bannerId: string;
  imageUrl: string;
};

interface ImageCarouselProps {
  gap?: number;
  images?: string[];
  banners?: CarouselBannerItem[];
  onPressBanner?: (bannerId: string) => void;
  onActiveIndexChange?: (index: number) => void;
  slideBackgroundColor?: string;
  imageResizeMode?: ImageResizeMode;
  /** true면 슬라이드 너비는 유지하고 높이는 이미지 비율에 맞춤 (회색 여백 없음) */
  fitImageHeight?: boolean;
  /** 캐러셀 무한 순환 (홈·큐레이션 배너만 true 권장) */
  loop?: boolean;
  headerTitle?: string;
  onPressMore?: () => void;
}

type ImageDimensions = {
  width: number;
  height: number;
};

function resolveSlideHeight(
  slideWidth: number,
  dimensions: ImageDimensions | undefined,
): number | null {
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
    return null;
  }
  return slideWidth * (dimensions.height / dimensions.width);
}

type CarouselSlideProps = {
  uri: string;
  slideSize: number;
  gap: number;
  slideBackgroundColor: string;
  imageResizeMode: ImageResizeMode;
  fitImageHeight: boolean;
  slideHeight: number;
  onDimensions?: (uri: string, width: number, height: number) => void;
  onPress?: () => void;
};

const CarouselSlide = ({
  uri,
  slideSize,
  gap,
  slideBackgroundColor,
  imageResizeMode,
  fitImageHeight,
  slideHeight,
  onDimensions,
  onPress,
}: CarouselSlideProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [uri]);

  const slide = (
    <View
      style={[
        styles.slide,
        {
          width: slideSize,
          height: slideHeight,
          marginHorizontal: gap,
          ...(fitImageHeight
            ? { backgroundColor: "transparent" }
            : { backgroundColor: slideBackgroundColor }),
        },
      ]}
    >
      {!fitImageHeight && !isLoaded ? (
        <View
          style={[
            styles.slidePlaceholder,
            { backgroundColor: slideBackgroundColor },
          ]}
        />
      ) : null}
      <Image
        source={{ uri }}
        style={{ width: slideSize, height: slideHeight }}
        resizeMode={fitImageHeight ? "cover" : imageResizeMode}
        onLoad={(event) => {
          const { width, height } = event.nativeEvent.source;
          if (width > 0 && height > 0) {
            onDimensions?.(uri, width, height);
          }
          setIsLoaded(true);
        }}
        onError={() => setIsLoaded(true)}
      />
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{slide}</Pressable>;
  }

  return slide;
};

type FitHeightImageGalleryProps = {
  uris: string[];
  gap: number;
  activeIndex: number;
  imageDimensions: Record<string, ImageDimensions>;
  rememberDimensions: (uri: string, width: number, height: number) => void;
  onActiveIndexChange?: (index: number) => void;
  onPressImage?: (index: number) => void;
};

const FitHeightImageGallery = ({
  uris,
  gap,
  activeIndex,
  imageDimensions,
  rememberDimensions,
  onActiveIndexChange,
  onPressImage,
}: FitHeightImageGalleryProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const slideWidth = Math.max(0, layoutWidth - gap * 2);
  const activeUri = uris[activeIndex] ?? "";
  const activeDimensions = imageDimensions[activeUri];
  const activeHeight = resolveSlideHeight(slideWidth, activeDimensions);

  const handleLayout = (width: number) => {
    const next = Math.round(width);
    setLayoutWidth((prev) => (prev === next ? prev : next));
  };

  const renderImage = (uri: string, index: number) => {
    const dims = imageDimensions[uri];
    if (!dims || slideWidth <= 0) return null;
    const aspectRatio = dims.width / dims.height;

    const image = (
      <Image
        source={{ uri }}
        style={[styles.slide, { width: slideWidth, aspectRatio }]}
        resizeMode="cover"
        onLoad={(event) => {
          const { width, height } = event.nativeEvent.source;
          if (width > 0 && height > 0) {
            rememberDimensions(uri, width, height);
          }
        }}
      />
    );

    if (!onPressImage) return image;

    return (
      <Pressable onPress={() => onPressImage(index)} accessibilityRole="image">
        {image}
      </Pressable>
    );
  };

  if (layoutWidth <= 0 || activeHeight == null) {
    return (
      <View
        style={styles.containerFit}
        onLayout={(event) => handleLayout(event.nativeEvent.layout.width)}
      />
    );
  }

  if (uris.length === 1) {
    return (
      <View
        style={styles.containerFit}
        onLayout={(event) => handleLayout(event.nativeEvent.layout.width)}
      >
        <View style={{ paddingHorizontal: gap }}>{renderImage(uris[0], 0)}</View>
      </View>
    );
  }

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / layoutWidth);
    onActiveIndexChange?.(index);
  };

  return (
    <View
      style={styles.containerFit}
      onLayout={(event) => handleLayout(event.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={{ width: layoutWidth, height: activeHeight }}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {uris.map((uri, index) => (
          <View
            key={uri}
            style={{
              width: layoutWidth,
              height: activeHeight,
              paddingHorizontal: gap,
              justifyContent: "flex-start",
            }}
          >
            {renderImage(uri, index)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const ImageCarousel = ({
  gap = 12,
  images,
  banners,
  onPressBanner,
  onActiveIndexChange,
  slideBackgroundColor,
  imageResizeMode = "cover",
  fitImageHeight = false,
  loop = false,
  headerTitle,
  onPressMore,
}: ImageCarouselProps) => {
  const screenWidth = Dimensions.get("window").width;
  const slideSize = screenWidth - gap * 2;
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, ImageDimensions>
  >({});
  const imageViewer = useImageViewerOptional();

  const rememberDimensions = useCallback(
    (uri: string, width: number, height: number) => {
      setImageDimensions((prev) => {
        const existing = prev[uri];
        if (existing?.width === width && existing?.height === height) {
          return prev;
        }
        return { ...prev, [uri]: { width, height } };
      });
    },
    [],
  );

  const data = useMemo(() => {
    if (banners && banners.length > 0) return banners;
    if (images && images.length > 0) return images;
    return [];
  }, [banners, images]);

  const uris = useMemo(
    () =>
      data.map((item) =>
        typeof item === "object" && item !== null && "imageUrl" in item
          ? (item as CarouselBannerItem).imageUrl
          : String(item),
      ),
    [data],
  );
  const urisKey = uris.join("|");

  useEffect(() => {
    if (!fitImageHeight || uris.length === 0) return;
    let cancelled = false;

    void Promise.all(
      uris.map(
        (uri) =>
          new Promise<void>((resolve) => {
            Image.getSize(
              uri,
              (width, height) => {
                if (!cancelled && width > 0 && height > 0) {
                  rememberDimensions(uri, width, height);
                }
                resolve();
              },
              () => resolve(),
            );
          }),
      ),
    );

    return () => {
      cancelled = true;
    };
  }, [fitImageHeight, uris, urisKey, rememberDimensions]);

  useEffect(() => {
    setActiveIndex(0);
  }, [urisKey]);

  if (data.length === 0) {
    return null;
  }

  if (fitImageHeight) {
    const activeUri = uris[activeIndex] ?? "";
    if (!imageDimensions[activeUri]) {
      return null;
    }

    return (
      <FitHeightImageGallery
        uris={uris}
        gap={gap}
        activeIndex={activeIndex}
        imageDimensions={imageDimensions}
        rememberDimensions={rememberDimensions}
        onActiveIndexChange={(index) => {
          setActiveIndex(index);
          onActiveIndexChange?.(index);
        }}
        onPressImage={
          imageViewer
            ? (index) => imageViewer.openImageViewer(uris, index)
            : undefined
        }
      />
    );
  }

  const carouselHeight = slideSize;

  const showPagination = data.length > 1;
  const resolvedSlideBackgroundColor = slideBackgroundColor ?? GRAY.DEFAULT;

  return (
    <View style={styles.container}>
      {headerTitle && onPressMore ? (
        <Pressable onPress={onPressMore} style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <MaterialIcons name="chevron-right" size={28} color="#000" />
        </Pressable>
      ) : null}
      <Carousel
        ref={ref}
        width={screenWidth}
        height={carouselHeight}
        loop={loop}
        autoFillData={loop}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => {
          setActiveIndex(index);
          onActiveIndexChange?.(index);
        }}
        onProgressChange={(_offsetProgress, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        data={data as string[]}
        renderItem={({ item }) => {
          const isBanner =
            typeof item === "object" && item !== null && "bannerId" in item;
          const uri = isBanner
            ? (item as CarouselBannerItem).imageUrl
            : String(item);
          const bannerId = isBanner
            ? (item as CarouselBannerItem).bannerId
            : undefined;

          const slide = (
            <CarouselSlide
              uri={uri}
              slideSize={slideSize}
              gap={gap}
              slideBackgroundColor={resolvedSlideBackgroundColor}
              imageResizeMode={imageResizeMode}
              fitImageHeight={false}
              slideHeight={slideSize}
              onPress={
                bannerId && onPressBanner
                  ? () => onPressBanner(bannerId)
                  : undefined
              }
            />
          );

          return slide;
        }}
      />
      {showPagination ? (
        <Pagination.Basic
          progress={progress}
          data={data as string[]}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          containerStyle={styles.pagination}
          onPress={(index) => {
            ref.current?.scrollTo({
              count: index - progress.value,
              animated: true,
            });
          }}
        />
      ) : null}
    </View>
  );
};

export default ImageCarousel;
