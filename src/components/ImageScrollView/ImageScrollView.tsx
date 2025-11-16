import {
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Styles {
  container?: StyleProp<ViewStyle>;
}

interface ImageScrollViewProp {
  styles: Styles;
  width: number;
  height: number;
  gap: number;
}

const ImageScrollView = ({ styles, width, height, gap }: ImageScrollViewProp) => {
  const imageLinkList = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
  ];

  return (
    <ScrollView
      horizontal
      style={[defaultStyles.container, styles.container,  { height: height }]}
      contentContainerStyle={{gap: gap}}
      showsHorizontalScrollIndicator={false}
    >
      {imageLinkList.map((imageLink, index) => (
        <Pressable key={index} style={{width: width, height: height}}>
          <Image
            source={{ uri: imageLink }}
            style={defaultStyles.image}
            resizeMode="cover"
          />
        </Pressable>
      ))}
    </ScrollView>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flexGrow: 0,
    paddingHorizontal: 12,
  },
  contentContainer: {
    // alignItems: "center",
    // gap: 5,
    marginHorizontal: 5,
  },
  // imageContainer: {
  //   // height: 183,
  //   width: 339,
  // },
  image: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
});

export default ImageScrollView;
