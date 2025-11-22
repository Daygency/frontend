import { useRef } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

interface ImageCarouselProps {
  width: number;
  height: number;
  gap: number;
  images?: string[];
}

const ImageCarousel = ({ width, height, gap, images }: ImageCarouselProps) => {
  const WIDTH = Dimensions.get("window").width;
  const progress = useSharedValue<number>(0);
  const ref = useRef<ICarouselInstance>(null);

  const imageLinkList = images || [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
  ];

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const data = images || imageLinkList;

  return (
    <View style={defaultStyles.container}>
      <View style={defaultStyles.carouselWrapper}>
        <Carousel
          ref={ref}
          style={defaultStyles.carouselContainer}
          width={WIDTH}
          height={height}
          scrollAnimationDuration={1000}
          onProgressChange={(offsetProgress, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          data={data}
          renderItem={({ item }) => (
            <View style={[defaultStyles.imageWrapper, { paddingHorizontal: gap }]}>
              <Image
                source={{ uri: item }}
                style={defaultStyles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
        {/* <View style={defaultStyles.paginationContainer}>
          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
            activeDotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#f1f1f1",
            }}
            containerStyle={{
              gap: 5,
              marginBottom: 10,
            }}
            onPress={onPressPagination}
          />
        </View> */}
      </View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselWrapper: {
    width: "100%",
    position: "relative",
  },
  carouselContainer: {
    flexGrow: 0,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default ImageCarousel;
