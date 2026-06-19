import { useEffect, useState } from "react";
import { Image, View, type StyleProp, type ViewStyle } from "react-native";
import { GRAY } from "../../color";
import { pickProfileImageUrlDeep } from "./peerImageFields";
import type { ChatPeerSummary } from "../apis/chat/types";
import { usePeerAvatarUrl } from "./usePeerAvatarUrl";

type Props = {
  peerUserId?: string | null;
  peer?: ChatPeerSummary | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * 지원자/합격자 카드용 — 채팅 peer URL이 비어 있어도 userId로 공개 프로필 이미지 보조 조회
 */
export default function ApplicantAvatar({
  peerUserId,
  peer,
  size = 44,
  style,
}: Props) {
  const fromPeer =
    (peer ? pickProfileImageUrlDeep(peer) : undefined) ??
    peer?.profileImageUrl;
  const uid = (peerUserId ?? peer?.userId ?? "").trim() || undefined;
  const avatarUrl = usePeerAvatarUrl(uid, fromPeer);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    setImgErr(false);
  }, [avatarUrl]);

  const r = size / 2;
  const baseStyle = [{ width: size, height: size, borderRadius: r }, style];

  return (
    <View style={baseStyle}>
      {avatarUrl && !imgErr ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: r }}
          resizeMode="cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: r,
            backgroundColor: GRAY.MEDIUM_2,
          }}
        />
      )}
    </View>
  );
}
