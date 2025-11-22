import {
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import defaultStyles from "./styles";

interface Styles {
  container?: StyleProp<ViewStyle>;
}

interface ImageScrollViewProp {
  styles: Styles;
  width: number;
  height: number;
  gap: number;
  images?: string[];
}

const ImageScrollView = ({ styles, width, height, gap, images }: ImageScrollViewProp) => {
  const imageLinkList = images || [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXJXvihqHAz65lWUqZ0IOV45CSYVL41PufXA&s",
  ];

  return (
    <ScrollView
      horizontal
      style={[defaultStyles.container, styles?.container,  { height: height }]}
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

export default ImageScrollView;
