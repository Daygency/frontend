import { useMemo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BLACK } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";
import MagazineCardOverlay from "../MagazineCardOverlay";

export type MagazineHeroCarouselItem = {
  bannerId: string;
  title: string;
  imageUrl: string;
};

type MagazineHeroCarouselProps = {
  items: MagazineHeroCarouselItem[];
  onPressItem?: (bannerId: string) => void;
};

const { width: screenWidth } = Dimensions.get("window");
const CONTAINER_HEIGHT = 250;
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = 250;
const CARD_GAP = 10;
const ITEM_WIDTH = CARD_WIDTH + CARD_GAP;

type CarouselCardProps = {
  item: MagazineHeroCarouselItem;
  animationValue: { value: number };
  onPressItem?: (bannerId: string) => void;
};

const CarouselCard = ({
  item,
  animationValue,
  onPressItem,
}: CarouselCardProps) => {
  const animatedCardStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationValue.value, [-1, 0, 1], [2, 6, 2]);
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.9, 1, 0.9]);
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.72, 1, 0.72]);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.slideWrap, animatedCardStyle]}>
      <Pressable
        style={styles.slide}
        onPress={() => onPressItem?.(item.bannerId)}
      >
        <View style={styles.imageFrame}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <MagazineCardOverlay title={item.title} variant="large" />
      </Pressable>
    </Animated.View>
  );
};

const MagazineHeroCarousel = ({
  items,
  onPressItem,
}: MagazineHeroCarouselProps) => {
  const data = useMemo(() => items.slice(0, 3), [items]);

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={ITEM_WIDTH}
        height={CONTAINER_HEIGHT}
        data={data}
        loop={data.length >= 3}
        autoPlay={data.length > 1}
        autoPlayInterval={4200}
        pagingEnabled
        snapEnabled
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: ITEM_WIDTH - CARD_WIDTH + 100,
          parallaxAdjacentItemScale: 0.88,
        }}
        renderItem={({ item, animationValue }) => (
          <CarouselCard
            item={item}
            animationValue={animationValue}
            onPressItem={onPressItem}
          />
        )}
      />
    </View>
  );
};

const styles = themedStyles(() => ({
  container: {
    height: CONTAINER_HEIGHT,
    marginTop: 0,
    overflow: "visible",
    alignItems: "center",
  },
  carousel: {
    overflow: "visible",
  },
  slideWrap: {
    width: ITEM_WIDTH,
    height: CONTAINER_HEIGHT,
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: 0,
  },
  slide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
    marginTop: 0,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111113",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  imageFrame: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
}));

export default MagazineHeroCarousel;
