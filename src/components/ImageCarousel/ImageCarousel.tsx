import { useRef } from "react";
import {
  Dimensions,
  Image,
  Pressable,
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
  headerTitle?: string;
  onPressMore?: () => void;
}

const ImageCarousel = ({
  gap = 12,
  images,
  banners,
  onPressBanner,
  onActiveIndexChange,
  headerTitle,
  onPressMore,
}: ImageCarouselProps) => {
  const screenWidth = Dimensions.get("window").width;
  const slideSize = screenWidth - gap * 2;
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);

  if (banners !== undefined && banners.length === 0) {
    return null;
  }

  if (banners === undefined && images !== undefined && images.length === 0) {
    return null;
  }

  const data =
    banners && banners.length > 0
      ? banners
      : images && images.length > 0
        ? images
        : [];

  if (data.length === 0) {
    return null;
  }

  const showPagination = data.length > 1;

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
        height={slideSize}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => onActiveIndexChange?.(index)}
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
            <View
              style={[
                styles.slide,
                {
                  width: slideSize,
                  height: slideSize,
                  marginHorizontal: gap,
                },
              ]}
            >
              <Image
                source={{ uri }}
                style={styles.slideImage}
                resizeMode="cover"
              />
            </View>
          );

          return bannerId && onPressBanner ? (
            <Pressable onPress={() => onPressBanner(bannerId)}>{slide}</Pressable>
          ) : (
            slide
          );
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
