import { View } from "react-native";
import skeletonStyles from "./musicNewsDetailSkeletonStyles";

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

const InfoRow = () => (
  <View style={skeletonStyles.infoRow}>
    <Box style={skeletonStyles.infoLabel} />
    <Box light style={skeletonStyles.infoValue} />
  </View>
);

const CommentRow = () => (
  <View style={skeletonStyles.commentRow}>
    <Box style={skeletonStyles.commentAvatar} />
    <View style={skeletonStyles.commentBody}>
      <Box style={skeletonStyles.commentAuthor} />
      <Box light style={skeletonStyles.commentLine} />
    </View>
  </View>
);

const MusicNewsDetailSkeleton = () => (
  <View>
    <Box style={skeletonStyles.hero} />

    <View style={skeletonStyles.body}>
      <View style={skeletonStyles.titleRow}>
        <Box style={skeletonStyles.title} />
        <View style={skeletonStyles.titleActions}>
          <Box light style={skeletonStyles.titleActionItem} />
          <Box light style={skeletonStyles.titleActionItem} />
        </View>
      </View>

      <InfoRow />
      <InfoRow />
      <InfoRow />

      <View style={skeletonStyles.bodySectionBlock}>
        <Box style={skeletonStyles.sectionLabel} />
        <Box light style={skeletonStyles.textLine} />
        <Box light style={skeletonStyles.textLine} />
        <Box light style={skeletonStyles.textLine} />
      </View>

      <View style={skeletonStyles.actionDivider} />
      <View style={skeletonStyles.actionRow}>
        <Box light style={skeletonStyles.actionItem} />
      </View>
    </View>

    <View style={skeletonStyles.body}>
      <CommentRow />
      <CommentRow />
    </View>
  </View>
);

export default MusicNewsDetailSkeleton;
