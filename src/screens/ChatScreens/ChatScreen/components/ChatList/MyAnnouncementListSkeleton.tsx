import { View } from "react-native";
import skeletonStyles from "./myAnnouncementListSkeletonStyles";

const Box = ({ style, light }: { style?: object; light?: boolean }) => (
  <View
    style={[
      skeletonStyles.box,
      light ? skeletonStyles.boxLight : skeletonStyles.boxDark,
      style,
    ]}
  />
);

const MyAnnouncementRowSkeleton = () => (
  <View style={skeletonStyles.row}>
    <View style={skeletonStyles.titleRow}>
      <View style={skeletonStyles.titleWithCount}>
        <Box light style={skeletonStyles.title} />
        <Box light style={skeletonStyles.personCount} />
      </View>
      <Box light style={skeletonStyles.dDay} />
    </View>
    <View style={skeletonStyles.tagsRow}>
      <Box light style={skeletonStyles.typeTag} />
    </View>
  </View>
);

const MY_ANNOUNCEMENT_ROW_PLACEHOLDER_COUNT = 6;

const MyAnnouncementListSkeleton = () => (
  <View>
    {Array.from({ length: MY_ANNOUNCEMENT_ROW_PLACEHOLDER_COUNT }).map((_, index) => (
      <MyAnnouncementRowSkeleton key={index} />
    ))}
  </View>
);

export default MyAnnouncementListSkeleton;
