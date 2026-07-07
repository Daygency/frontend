import { View } from "react-native";
import skeletonStyles from "./musicNewsListSkeletonStyles";

const Box = ({
  style,
  light,
}: {
  style?: object;
  light?: boolean;
}) => (
  <View
    style={[
      skeletonStyles.box,
      light ? skeletonStyles.boxLight : skeletonStyles.boxDark,
      style,
    ]}
  />
);

const NewsCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <Box style={skeletonStyles.poster} />
    <View style={skeletonStyles.body}>
      <Box light style={skeletonStyles.titleLine} />
      <Box light style={skeletonStyles.titleLine2} />
      <Box light style={skeletonStyles.timeLine} />
      <Box light style={skeletonStyles.placeLine} />
      <Box light style={skeletonStyles.priceLine} />
    </View>
  </View>
);

const NEWS_CARD_PLACEHOLDER_COUNT = 6;

const MusicNewsListSkeleton = () => (
  <View>
    {Array.from({ length: NEWS_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
      <View key={index}>
        <NewsCardSkeleton />
        {index < NEWS_CARD_PLACEHOLDER_COUNT - 1 ? (
          <View style={skeletonStyles.separator} />
        ) : null}
      </View>
    ))}
  </View>
);

export default MusicNewsListSkeleton;
