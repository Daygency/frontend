import { Image, Pressable, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import styles from "./styles";
import { useImageViewerOptional } from "../../../contexts/ImageViewerContext";

interface PhotoGridProps {
  images: string[];
}

/**
 * 채팅 앱(카톡/인스타)처럼 장수에 따라 배치가 달라지는 사진 그리드.
 * 1장은 꽉 찬 정사각형, 2장은 반반, 3장 이상은 큰 사진 1장 + 작은 사진 2장이며
 * 4장 이상이면 세 번째(마지막) 타일에 "+N" 딤드 오버레이로 나머지 장수를 표시.
 */
const PhotoGrid = ({ images }: PhotoGridProps) => {
  const imageViewer = useImageViewerOptional();

  if (images.length === 0) return null;

  const openViewer = (index: number) => imageViewer?.openImageViewer(images, index);

  const renderTile = (
    uri: string,
    index: number,
    sizeStyle: StyleProp<ViewStyle>,
    overlayCount?: number,
  ) => (
    <Pressable
      key={`${uri}-${index}`}
      style={[styles.tile, sizeStyle]}
      onPress={() => openViewer(index)}
    >
      <View style={styles.tileInner}>
        <Image source={{ uri }} style={styles.tileImage} resizeMode="cover" />
        {overlayCount ? (
          <View style={styles.tileOverlay} pointerEvents="none">
            <Text style={styles.tileOverlayText}>+{overlayCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  const count = images.length;

  if (count === 1) {
    return (
      <View style={styles.container}>
        {renderTile(images[0], 0, styles.full)}
      </View>
    );
  }

  if (count === 2) {
    return (
      <View style={[styles.container, styles.row]}>
        {images.map((uri, index) => renderTile(uri, index, styles.half))}
      </View>
    );
  }

  // 3장 이상 — 큰 사진 1장 + 작은 사진 2장. 4장 이상이면 마지막 타일에 "+N" 오버레이
  const hiddenCount = count - 3;
  return (
    <View style={[styles.container, styles.row]}>
      {renderTile(images[0], 0, styles.twoThirds)}
      <View style={[styles.column, styles.oneThirdColumn]}>
        {renderTile(images[1], 1, styles.full)}
        {renderTile(
          images[2],
          2,
          styles.full,
          hiddenCount > 0 ? hiddenCount : undefined,
        )}
      </View>
    </View>
  );
};

export default PhotoGrid;
