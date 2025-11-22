import { useRef } from "react";
import {
  Dimensions,
  Image,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import styles from "./styles";

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
    <View style={styles.container}>
      <View style={styles.carouselWrapper}>
        <Carousel
          ref={ref}
          style={styles.carouselContainer}
          width={WIDTH}
          height={height}
          scrollAnimationDuration={1000}
          onProgressChange={(offsetProgress, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          data={data}
          renderItem={({ item }) => (
            <View style={[styles.imageWrapper, { paddingHorizontal: gap }]}>
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        />
        {/* <View style={styles.paginationContainer}>
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

export default ImageCarousel;
