import { View } from "react-native";
import skeletonStyles from "./communityListSkeletonStyles";

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

const CommunityCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <Box light style={skeletonStyles.avatar} />
    <View style={skeletonStyles.body}>
      <View style={skeletonStyles.headerRow}>
        <Box light style={skeletonStyles.username} />
        <Box light style={skeletonStyles.timestamp} />
      </View>
      <Box style={skeletonStyles.title} />
      <Box light style={skeletonStyles.contentLine} />
      <Box light style={skeletonStyles.contentLine2} />
      <View style={skeletonStyles.footerRow}>
        <Box light style={skeletonStyles.footerItem} />
        <Box light style={skeletonStyles.footerItem} />
      </View>
    </View>
  </View>
);

const COMMUNITY_CARD_PLACEHOLDER_COUNT = 6;

const CommunityListSkeleton = () => (
  <View>
    {Array.from({ length: COMMUNITY_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
      <CommunityCardSkeleton key={index} />
    ))}
  </View>
);

export default CommunityListSkeleton;
