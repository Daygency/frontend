import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resolveProfileImageUrlForDisplay } from "../../../lib/chat/resolveProfileImageUrl";
import {
  downloadImageToDevice,
  shareImage,
} from "../../../lib/media/imageViewerActions";
import styles from "./styles";

type Props = {
  urls: string[];
  initialIndex?: number;
  onClose: () => void;
};

const ImageViewerModal = ({ urls, initialIndex = 0, onClose }: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const imageAreaHeight = Math.max(0, screenHeight - top - bottom - 120);
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const index = Math.max(0, Math.min(initialIndex, urls.length - 1));
    setCurrentIndex(index);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: index * screenWidth, animated: false });
    });
  }, [initialIndex, screenWidth, urls.length]);

  const currentUrl = urls[currentIndex] ?? urls[0] ?? "";

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <Modal
      visible
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={[styles.safe, { paddingTop: top, paddingBottom: bottom }]}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Ionicons name="chevron-back" size={28} style={styles.actionIcon} />
            </Pressable>
          </View>

          <View style={[styles.imageArea, { height: imageAreaHeight }]}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleScrollEnd}
              style={{ width: screenWidth, height: imageAreaHeight }}
            >
              {urls.map((url, index) => {
                const displayUrl = resolveProfileImageUrlForDisplay(url) ?? url;
                return (
                  <View
                    key={`${url}-${index}`}
                    style={[styles.page, { width: screenWidth, height: imageAreaHeight }]}
                  >
                    <Image
                      source={{ uri: displayUrl }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.bottomBar}>
            <Pressable
              style={styles.actionButton}
              onPress={() => {
                if (currentUrl) void downloadImageToDevice(currentUrl);
              }}
              accessibilityRole="button"
              accessibilityLabel="다운로드"
            >
              <Ionicons name="download-outline" size={26} style={styles.actionIcon} />
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => {
                if (currentUrl) void shareImage(currentUrl);
              }}
              accessibilityRole="button"
              accessibilityLabel="공유"
            >
              <Ionicons name="share-outline" size={26} style={styles.actionIcon} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageViewerModal;
