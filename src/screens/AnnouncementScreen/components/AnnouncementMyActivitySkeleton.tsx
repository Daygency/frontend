import { View } from "react-native";
import skeletonStyles from "./announcementMyActivitySkeletonStyles";

export const StatValueSkeleton = () => (
  <View style={[skeletonStyles.box, skeletonStyles.boxLight, skeletonStyles.statValue]} />
);
