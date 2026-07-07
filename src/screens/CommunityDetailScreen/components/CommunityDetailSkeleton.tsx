import { View } from "react-native";
import skeletonStyles from "./communityDetailSkeletonStyles";

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

const CommunityDetailSkeleton = () => (
  <View style={skeletonStyles.body}>
    <Box style={skeletonStyles.category} />
    <Box style={skeletonStyles.title} />

    <View style={skeletonStyles.authorMetaRow}>
      <Box style={skeletonStyles.avatar} />
      <View style={skeletonStyles.authorMetaText}>
        <Box light style={skeletonStyles.authorName} />
        <Box light style={skeletonStyles.postDate} />
      </View>
    </View>

    <View style={skeletonStyles.divider} />

    <Box light style={skeletonStyles.textLine} />
    <Box light style={skeletonStyles.textLine} />
    <Box light style={skeletonStyles.textLine} />

    <Box style={skeletonStyles.image} />

    <Box light style={skeletonStyles.bottomBar} />
  </View>
);

export default CommunityDetailSkeleton;
