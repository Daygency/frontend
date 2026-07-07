import { useEffect, useState } from "react";
import { Image, Pressable } from "react-native";
import { GRAY } from "../../../color";
import { MEDIA_MAX_WIDTH } from "./mediaSize";

const MAX_WIDTH = MEDIA_MAX_WIDTH;
const MAX_HEIGHT = 280;
const MIN_WIDTH = 120;
const FALLBACK_SIZE = { width: MAX_WIDTH, height: MAX_WIDTH };

function fitToBounds(ratio: number) {
  let width = MAX_WIDTH;
  let height = width / ratio;
  if (height > MAX_HEIGHT) {
    height = MAX_HEIGHT;
    width = height * ratio;
  }
  if (width < MIN_WIDTH) {
    width = MIN_WIDTH;
    height = Math.min(width / ratio, MAX_HEIGHT);
  }
  return { width, height };
}

/** 실제 이미지 비율에 맞춰 크기가 변하는 채팅 말풍선 이미지 (세로로 긴 사진도 잘리지 않음) */
const ChatImageMessage = ({
  uri,
  onPress,
}: {
  uri: string;
  onPress: () => void;
}) => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    Image.getSize(
      uri,
      (naturalWidth, naturalHeight) => {
        if (cancelled || !naturalWidth || !naturalHeight) return;
        setSize(fitToBounds(naturalWidth / naturalHeight));
      },
      () => {
        if (!cancelled) setSize(FALLBACK_SIZE);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [uri]);

  const displaySize = size ?? FALLBACK_SIZE;

  return (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri }}
        style={{
          width: displaySize.width,
          height: displaySize.height,
          borderRadius: 12,
          backgroundColor: GRAY.DARK_1,
        }}
        resizeMode="cover"
      />
    </Pressable>
  );
};

export default ChatImageMessage;
