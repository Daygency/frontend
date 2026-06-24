import type { StyleProp, ViewStyle } from "react-native";
import UserProfileAvatar from "../../ui/UserProfileAvatar";

type Props = {
  profileImgUrl?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const CommentAuthorAvatar = ({ profileImgUrl, size = 40, style }: Props) => (
  <UserProfileAvatar
    profileImgUrl={profileImgUrl}
    size={size}
    style={style}
  />
);

export default CommentAuthorAvatar;
