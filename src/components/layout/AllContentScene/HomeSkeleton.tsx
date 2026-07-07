import { View } from "react-native";
import skeletonStyles from "./homeSkeletonStyles";

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

const NEWS_CARD_PLACEHOLDER_COUNT = 3;

const HomeSkeleton = () => (
  <View>
    <View style={skeletonStyles.hero}>
      <Box style={skeletonStyles.heroCard} />
    </View>

    <View style={skeletonStyles.shortcutRow}>
      <Box light style={skeletonStyles.pillApplied} />
      <Box light style={skeletonStyles.pillPosted} />
    </View>

    <View style={skeletonStyles.section}>
      <View style={skeletonStyles.sectionHeader}>
        <Box style={skeletonStyles.sectionTitle} />
      </View>
      <View style={skeletonStyles.newsRow}>
        {Array.from({ length: NEWS_CARD_PLACEHOLDER_COUNT }).map((_, index) => (
          <View key={index} style={skeletonStyles.newsCard}>
            <Box style={skeletonStyles.newsImage} />
            <Box light style={skeletonStyles.newsTitleLine} />
            <Box light style={skeletonStyles.newsTitleLine2} />
            <Box light style={skeletonStyles.newsPlaceLine} />
            <Box light style={skeletonStyles.newsDateLine} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default HomeSkeleton;
