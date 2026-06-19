import { useEffect, useState } from "react";
import {
  Image,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GRAY } from "../../color";
import { resolveProfileImageUrlForDisplay } from "../../lib/chat/resolveProfileImageUrl";

type Props = {
  profileImgUrl?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

const CommentAuthorAvatar = ({
  profileImgUrl,
  size = 40,
  style,
}: Props) => {
  const [imgErr, setImgErr] = useState(false);
  const uri = resolveProfileImageUrlForDisplay(profileImgUrl);

  useEffect(() => {
    setImgErr(false);
  }, [profileImgUrl]);

  const baseStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#102042",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    overflow: "hidden" as const,
  };

  if (uri && !imgErr) {
    return (
      <Image
        source={{ uri }}
        style={[baseStyle, style]}
        resizeMode="cover"
        onError={() => setImgErr(true)}
      />
    );
  }

  return (
    <View style={[baseStyle, style]}>
      <Ionicons
        name="person-outline"
        size={Math.round(size * 0.45)}
        color={GRAY.MEDIUM}
      />
    </View>
  );
};

export default CommentAuthorAvatar;
