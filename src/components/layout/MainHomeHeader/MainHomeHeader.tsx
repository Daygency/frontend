import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import styles from "./styles";

export const MAIN_HOME_TABS = ["홈", "큐레이션"] as const;
export type MainHomeTab = (typeof MAIN_HOME_TABS)[number];

export const LOUNGE_TABS = ["공연 소식", "커뮤니티"] as const;
export type LoungeTab = (typeof LOUNGE_TABS)[number];

interface MainHomeHeaderProps<T extends string = MainHomeTab> {
  tabs?: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  variant?: "light" | "dark";
}

const MainHomeHeader = <T extends string = MainHomeTab>({
  tabs = MAIN_HOME_TABS as unknown as readonly T[],
  activeTab,
  onTabChange,
  variant = "light",
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
    <View style={styles.container}>
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
                  isDark && styles.tabIndicatorDark,
                  { width: indicatorWidth },
                ]}
              />
            ) : (
              <View style={styles.tabIndicatorPlaceholder} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default MainHomeHeader;
