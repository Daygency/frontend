import { View } from "react-native";
import skeletonStyles from "./chatRoomListSkeletonStyles";

const Box = ({ style, light }: { style?: object; light?: boolean }) => (
  <View
    style={[
      skeletonStyles.box,
      light ? skeletonStyles.boxLight : skeletonStyles.boxDark,
      style,
    ]}
  />
);

const ChatRoomRowSkeleton = () => (
  <View style={skeletonStyles.row}>
    <Box light style={skeletonStyles.avatar} />
    <View style={skeletonStyles.content}>
      <View style={skeletonStyles.headerRow}>
        <Box light style={skeletonStyles.name} />
        <Box light style={skeletonStyles.timestamp} />
      </View>
      <Box light style={skeletonStyles.message} />
    </View>
  </View>
);

const CHAT_ROOM_ROW_PLACEHOLDER_COUNT = 8;

const ChatRoomListSkeleton = () => (
  <View>
    {Array.from({ length: CHAT_ROOM_ROW_PLACEHOLDER_COUNT }).map((_, index) => (
      <ChatRoomRowSkeleton key={index} />
    ))}
  </View>
);

export default ChatRoomListSkeleton;
