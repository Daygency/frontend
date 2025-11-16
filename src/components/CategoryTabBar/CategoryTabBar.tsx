import { StyleSheet, Text } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";
import { GRAY, MAIN, WHITE } from "../../color";

const CategoryTabBar = (props: TabBarProps<any>) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: MAIN.DEFAULT, height: 1 }}
      style={styles.tabBar}
      scrollEnabled
      tabStyle={styles.tabBarItem}
      labelStyle={styles.tabLabel}
      activeColor={MAIN.DEFAULT}
      inactiveColor={GRAY.DARK}
      pressColor="transparent"
      renderLabel={({ route, focused }: { route: { title: string; key: string }; focused: boolean }) => (
        <Text
          style={[
            styles.tabLabel,
            focused && styles.tabLabelSelected,
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: WHITE,
    height: 48,
    paddingBottom: 6,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: {
    width: "auto",
    minWidth: 80,
    paddingHorizontal: 22,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: GRAY.DEFAULT,
    minHeight: 42,
  },
  tabLabel: {
    fontSize: 14,
    color: GRAY.DARK,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tabLabelSelected: {
    fontWeight: "600",
  },
});

export default CategoryTabBar;

