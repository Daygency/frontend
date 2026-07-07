import { View } from "react-native";
import skeletonStyles from "./announcementListSkeletonStyles";

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

const AnnouncementCardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.topSection}>
      <View style={skeletonStyles.profileRow}>
        <Box light style={skeletonStyles.avatar} />
        <Box light style={skeletonStyles.authorName} />
        <Box light style={skeletonStyles.dDay} />
      </View>
      <Box style={skeletonStyles.title} />
    </View>

    <View style={skeletonStyles.footerSection}>
      <View style={skeletonStyles.tagsRow}>
        <View style={skeletonStyles.tagsGroup}>
          <Box light style={skeletonStyles.priceTag} />
          <Box light style={skeletonStyles.typeTag} />
          <Box light style={skeletonStyles.locationTag} />
        </View>
        <Box light style={skeletonStyles.footerMeta} />
      </View>
    </View>
  </View>
);

const ANNOUNCEMENT_CARD_PLACEHOLDER_COUNT = 6;

const AnnouncementListSkeleton = () => (
  <View>
    {Array.from({ length: ANNOUNCEMENT_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
      <AnnouncementCardSkeleton key={index} />
    ))}
  </View>
);

export default AnnouncementListSkeleton;
