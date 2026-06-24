import type { StyleProp, ViewStyle } from "react-native";
import type { ChatPeerSummary } from "../apis/chat/types";
import UserProfileAvatar from "../../components/ui/UserProfileAvatar";
import { pickProfileImageUrlDeep } from "./peerImageFields";

type Props = {
  peerUserId?: string;
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
    peer?.profileImageUrl ??
    peer?.profileImgUrl;
  const uid = (peerUserId ?? peer?.userId ?? "").trim() || undefined;

  return (
    <UserProfileAvatar
      peerUserId={uid}
      profileImgUrl={fromPeer}
      size={size}
      style={style}
    />
  );
}
