import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import styles from "./styles";

export const MAIN_HOME_TABS = ["홈", "매거진"] as const;
export type MainHomeTab = (typeof MAIN_HOME_TABS)[number];

export const LOUNGE_TABS = ["공연소식", "커뮤니티"] as const;
export type LoungeTab = (typeof LOUNGE_TABS)[number];

interface MainHomeHeaderProps<T extends string = MainHomeTab> {
  tabs?: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  variant?: "light" | "dark";
  /** 라운지 등 탭-필터 간격을 좁힐 때 */
  dense?: boolean;
  /** 상단 타이틀 자리에 인라인으로 끼워 넣을 때 (좌우 패딩/세로 여백 제거, 세로 중앙 정렬) */
  inline?: boolean;
}

const MainHomeHeader = <T extends string = MainHomeTab>({
  tabs = MAIN_HOME_TABS as unknown as readonly T[],
  activeTab,
  onTabChange,
  variant = "light",
  dense = false,
  inline = false,
}: MainHomeHeaderProps<T>) => {
  const [labelWidths, setLabelWidths] = useState<Partial<Record<string, number>>>(
    {},
  );

  const handleLabelLayout = (tab: T) => (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setLabelWidths((prev) => (prev[tab] === width ? prev : { ...prev, [tab]: width }));
  };

  const isDark = variant === "dark";

  return (
    <View
      style={[
        styles.container,
        dense && styles.containerDense,
        inline && styles.containerInline,
      ]}
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab;
        const indicatorWidth = labelWidths[tab];

        return (
          <Pressable
            key={tab}
            style={styles.tabButton}
            onPress={() => onTabChange(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text
              onLayout={handleLabelLayout(tab)}
              style={[
                styles.tabLabel,
                inline && styles.tabLabelInline,
                isDark && styles.tabLabelDark,
                selected && (isDark ? styles.tabLabelSelectedDark : styles.tabLabelSelected),
              ]}
            >
              {tab}
            </Text>
            {selected && indicatorWidth != null ? (
              <View
                style={[
                  styles.tabIndicator,
                  inline && styles.tabIndicatorInline,
                  isDark && styles.tabIndicatorDark,
                  { width: indicatorWidth },
                ]}
              />
            ) : inline ? null : (
              <View style={styles.tabIndicatorPlaceholder} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default MainHomeHeader;
