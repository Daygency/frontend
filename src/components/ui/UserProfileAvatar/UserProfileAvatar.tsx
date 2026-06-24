import { useEffect, useState } from "react";
import {
  Image,
  type ImageResizeMode,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { usePeerAvatarUrl } from "../../../lib/chat/usePeerAvatarUrl";
import { DEFAULT_USER_PROFILE_IMAGE } from "../../../lib/media/defaultUserProfileImage";

type Props = {
  profileImgUrl?: string | null;
  /** 목록 URL이 비어 있을 때 공개 프로필 보조 조회 */
  peerUserId?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
};

const UserProfileAvatar = ({
  profileImgUrl,
  peerUserId,
  size = 40,
  style,
  resizeMode = "cover",
}: Props) => {
  const avatarUrl = usePeerAvatarUrl(
    peerUserId,
    profileImgUrl ?? undefined,
  );
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [avatarUrl, profileImgUrl, peerUserId]);

  const imageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: "hidden" as const,
  };

  if (avatarUrl && !imgErr) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[imageStyle, style]}
        resizeMode={resizeMode}
        onError={() => setImgErr(true)}
      />
    );
  }

  return (
    <Image
      source={DEFAULT_USER_PROFILE_IMAGE}
      style={[imageStyle, style]}
      resizeMode={resizeMode}
    />
  );
};

export default UserProfileAvatar;
