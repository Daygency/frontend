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
}

const ImageScrollView = ({ styles }: ImageScrollViewProp) => {
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
      style={[defaultStyles.container, styles.container]}
      contentContainerStyle={defaultStyles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {imageLinkList.map((imageLink, index) => (
        <Pressable key={index} style={defaultStyles.imageContainer}>
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
    height: 196,
    flexGrow: 0,
  },
  contentContainer: {
    alignItems: "center",
    gap: 5,
  },
  imageContainer: {
    height: 196,
    width: 339,
  },
  image: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
});

export default ImageScrollView;
