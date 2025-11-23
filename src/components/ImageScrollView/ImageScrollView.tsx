import {
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  ViewStyle,
  Text
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
  type?: "withText" | "default";
}

const ImageScrollView = ({ styles, width, height, gap, images, type = "default" }: ImageScrollViewProp) => {
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
        <Pressable key={index} style={{width: width, height: type == "withText" ? height : "auto", marginRight: index === imageLinkList.length -1 ? 12 : 0}}>
          <Image
            source={{ uri: imageLink }}
            style={{...defaultStyles.image, height: type == "withText" ? 193 : height, borderRadius: 5}}
            resizeMode="cover"
          />
          {type === "withText" ? 
            <>
              <Text style={defaultStyles.imageTitle} numberOfLines={2} ellipsizeMode="tail">공연 제목이 들어가는 자리입니다.공연 제목이 들어가는 자리입니다.</Text>
              <Text style={defaultStyles.imageSpace}>토끼마을</Text>
              <Text style={defaultStyles.imageDate}>2000.05.16 ~ 2003.07.15</Text>
            </> :  null
          }
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default ImageScrollView;
