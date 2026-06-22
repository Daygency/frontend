import { useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { GRAY, MAIN, WHITE } from "../../color";
import styles from "./styles";

export type MainHomeTab = "홈" | "큐레이션";

const TABS: MainHomeTab[] = ["홈", "큐레이션"];

interface MainHomeHeaderProps {
  activeTab: MainHomeTab;
  onTabChange: (tab: MainHomeTab) => void;
  variant?: "light" | "dark";
}

const MainHomeHeader = ({
  activeTab,
  onTabChange,
  variant = "light",
}: MainHomeHeaderProps) => {
  const [labelWidths, setLabelWidths] = useState<Partial<Record<MainHomeTab, number>>>(
    {},
  );

  const handleLabelLayout = (tab: MainHomeTab) => (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setLabelWidths((prev) => (prev[tab] === width ? prev : { ...prev, [tab]: width }));
  };

  const isDark = variant === "dark";

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
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
