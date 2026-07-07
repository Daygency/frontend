import { View } from "react-native";
import skeletonStyles from "./announcementDetailSkeletonStyles";

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

const Divider = () => <View style={skeletonStyles.divider} />;

const InfoRow = () => (
  <View style={skeletonStyles.infoRow}>
    <Box style={skeletonStyles.infoLabel} />
    <Box style={skeletonStyles.infoValue} />
  </View>
);

const TextSection = () => (
  <View style={skeletonStyles.textSection}>
    <Box style={skeletonStyles.sectionLabel} />
    <Box light style={skeletonStyles.textLine} />
    <Box light style={skeletonStyles.textLine} />
  </View>
);

export const AnnouncementDetailBodySkeleton = () => (
  <View style={skeletonStyles.body}>
    <Box style={skeletonStyles.title} />

    <View style={skeletonStyles.badgeRow}>
      <Box style={skeletonStyles.badge} />
      <Box style={skeletonStyles.badge} />
    </View>

    <InfoRow />
    <InfoRow />
    <InfoRow />
    <InfoRow />

    <View style={skeletonStyles.blankSpace} />

    <Divider />
    <TextSection />
    <Divider />
    <TextSection />
    <Divider />
    <TextSection />
  </View>
);

export const AnnouncementDetailBottomBarSkeleton = ({
  paddingBottom,
}: {
  paddingBottom: number;
}) => (
  <View style={[skeletonStyles.bottomBar, { paddingBottom }]}>
    <Box style={skeletonStyles.bookmarkButton} />
    <Box style={skeletonStyles.mainButton} />
  </View>
);
