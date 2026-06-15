import { useState, useRef, useLayoutEffect } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRAY } from "../../../color";
import ShadowCardButton from "../../../components/ShadowCardButton/ShadowCardButton";
import FabButton from "../../../components/FabButton/FabButton";
import styles from "./styles";

const MOCK_DOCUMENTS: { id: string; title: string; date: string; size: string }[] = [];

const DocumentCard = ({
  title,
  date,
  size,
  onMorePress,
  isManageMode,
  isSelected,
  onSelect,
  cardSlideAnim,
  circleOpacityAnim,
}: {
  title: string;
  date: string;
  size: string;
  onMorePress: () => void;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  cardSlideAnim?: Animated.AnimatedInterpolation<number>;
  circleOpacityAnim?: Animated.Value;
}) => (
  <View style={[styles.cardRow, isManageMode && styles.cardRowManage]}>
    {isManageMode && circleOpacityAnim && (
      <Animated.View style={{ opacity: circleOpacityAnim }}>
        <Pressable
          hitSlop={8}
          onPress={onSelect}
          style={[styles.selectCircle, isSelected && styles.selectCircleSelected]}
        >
          {isSelected && (
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          )}
        </Pressable>
      </Animated.View>
    )}
    <Animated.View
      style={[
        styles.cardWrapper,
        isManageMode &&
          cardSlideAnim && { transform: [{ translateX: cardSlideAnim }] },
      ]}
    >
      <ShadowCardButton styles={{ container: [styles.card, isManageMode && styles.cardManage] }}>
        <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.cardMeta}>
            {date} · {size}
          </Text>
        </View>
        {!isManageMode && (
          <Pressable hitSlop={10} onPress={onMorePress} style={styles.moreButton}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={GRAY.DARK_100}
            />
          </Pressable>
        )}
        </View>
      </ShadowCardButton>
    </Animated.View>
  </View>
);

const ANIM_DURATION = 250;

const MyDataArchiveScreen = () => {
  const navigation = useNavigation<any>();
  const { bottom } = useSafeAreaInsets();
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const circleOpacityAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const fabOpacityAnim = useRef(new Animated.Value(1)).current;
  const toggleRef = useRef(() => {});
  toggleRef.current = () => {
    const entering = !isManageMode;
    if (entering) {
      setIsManageMode(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 36,
          duration: ANIM_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacityAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBarAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fabOpacityAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacityAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(bottomBarAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(fabOpacityAnim, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsManageMode(false);
        setSelectedIds(new Set());
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={10} onPress={() => toggleRef.current()}>
          <Text style={{ fontSize: 16, color: "#000" }}>
            {isManageMode ? "취소" : "관리"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isManageMode]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bottomBarTranslateY = bottomBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const cardSlideAnim = slideAnim.interpolate({
    inputRange: [0, 36],
    outputRange: [-36, 0],
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_DOCUMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard
            title={item.title}
            date={item.date}
            size={item.size}
            onMorePress={() => {}}
            isManageMode={isManageMode}
            isSelected={selectedIds.has(item.id)}
            onSelect={() => toggleSelect(item.id)}
            cardSlideAnim={cardSlideAnim}
            circleOpacityAnim={circleOpacityAnim}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          isManageMode && styles.listContentManage,
        ]}
        ListEmptyComponent={
          <View style={{ paddingVertical: 48, alignItems: "center" }}>
            <Text style={{ fontSize: 15, color: GRAY.DARK_2, textAlign: "center" }}>
              자료 보관함 기능은 준비 중입니다.
            </Text>
          </View>
        }
      />
      <Animated.View
        style={{
          position: "absolute",
          right: 20,
          bottom: 24 + bottom,
          opacity: fabOpacityAnim,
          width: 56,
          height: 56,
        }}
        pointerEvents={isManageMode ? "none" : "auto"}
      >
        <FabButton
          onPress={() => {}}
          containerStyle={{ right: 0, bottom: 0 }}
        />
      </Animated.View>
      {isManageMode && (
        <Animated.View
          style={[
            styles.bottomBar,
            {
              paddingBottom: 16 + bottom,
              opacity: bottomBarAnim,
              transform: [{ translateY: bottomBarTranslateY }],
            },
          ]}
        >
          <Pressable style={styles.bottomBarButton}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={24}
              color={GRAY.DARK_100}
            />
            <Text style={styles.bottomBarLabel}>파일 저장</Text>
          </Pressable>
          <Pressable style={styles.bottomBarButton}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color={GRAY.DARK_100}
            />
            <Text style={styles.bottomBarLabel}>휴지통</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default MyDataArchiveScreen;
