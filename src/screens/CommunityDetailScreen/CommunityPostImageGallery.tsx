import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { GRAY } from "../../color";

type Props = {
  urls: string[];
  onIndexChange?: (index: number) => void;
};

const CommunityPostImageGallery = ({ urls, onIndexChange }: Props) => {
  const [wrapWidth, setWrapWidth] = useState(0);

  if (urls.length === 0) return null;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (wrapWidth <= 0) return;
    const idx = Math.round(e.nativeEvent.contentOffset.x / wrapWidth);
    onIndexChange?.(idx);
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        const next = Math.round(e.nativeEvent.layout.width);
        setWrapWidth((prev) => (prev === next ? prev : next));
      }}
    >
      {urls.length === 1 ? (
        <View style={styles.slide}>
          <Image
            source={{ uri: urls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : wrapWidth > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ width: wrapWidth, height: wrapWidth }}
        >
          {urls.map((uri, index) => (
            <View
              key={`${uri}-${index}`}
              style={[styles.slide, { width: wrapWidth, height: wrapWidth }]}
            >
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.slidePlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    marginTop: 12,
  },
  slide: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: GRAY.MEDIUM,
  },
  slidePlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: GRAY.MEDIUM,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default CommunityPostImageGallery;
