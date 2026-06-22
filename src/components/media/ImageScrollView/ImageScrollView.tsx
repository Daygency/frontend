import { ScrollView, StyleProp, ViewStyle } from "react-native";
import defaultStyles from "./styles";
import EventNewsCard from "../../cards/EventNewsCard";

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
  onCardPress?: () => void;
}

const ImageScrollView = ({ styles, width, height, gap, images, type = "default", onCardPress }: ImageScrollViewProp) => {
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
      style={[defaultStyles.container, styles?.container, { height: height }]}
      contentContainerStyle={{ gap: gap }}
      showsHorizontalScrollIndicator={false}
    >
      {imageLinkList.map((imageLink, index) => (
        <EventNewsCard
          key={index}
          width={width}
          height={type === "withText" ? 193 : height}
          title="공연 제목이 들어가는 자리입니다.공연 제목이 들어가는 자리입니다."
          place="토끼마을"
          dateRange="2000.05.16 ~ 2003.07.15"
          imageUrl={imageLink}
          containerStyle={{
            marginRight: index === imageLinkList.length - 1 ? 12 : 0,
          }}
          onPress={onCardPress}
        />
      ))}
    </ScrollView>
  );
};

export default ImageScrollView;
