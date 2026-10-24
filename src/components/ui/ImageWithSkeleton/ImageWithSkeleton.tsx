import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageResizeMode,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SKELETON } from "../../../color";
import { themedStyles } from "../../../theme/themedStyles";

type Props = {
  /** 원격 이미지 URL. 없으면 스켈레톤 없이 fallbackSource를 바로 렌더 */
  uri?: string | null;
  /** uri가 없거나 로드에 실패했을 때 보여줄 로컬 이미지 */
  fallbackSource: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
};

/** 방마다 독립적으로 로딩 상태를 갖는 이미지: 로드 전엔 스켈레톤, 로드되면 이미지로 전환 */
const ImageWithSkeleton = ({
  uri,
  fallbackSource,
  style,
  resizeMode = "cover",
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [uri]);

  const showSkeleton = !!uri && !error && !loaded;
  const source = uri && !error ? { uri } : fallbackSource;

  return (
    <View style={[styles.container, style]}>
      {showSkeleton && (
        <View style={[StyleSheet.absoluteFill, styles.skeleton]} />
      )}
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </View>
  );
};

const styles = themedStyles(() => ({
  container: {
    overflow: "hidden",
  },
  skeleton: {
    backgroundColor: SKELETON.LIGHT,
  },
}));

export default ImageWithSkeleton;
