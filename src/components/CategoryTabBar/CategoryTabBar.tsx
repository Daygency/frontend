import { Text } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";
import { GRAY, MAIN } from "../../color";
import styles from "./styles";

interface CategoryTabBarProps extends TabBarProps<any> {
  evenlyDistributed?: boolean;
}

const CategoryTabBar = ({ evenlyDistributed = false, ...props }: CategoryTabBarProps) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: MAIN.DEFAULT, height: 1 }}
      style={styles.tabBar}
      scrollEnabled={!evenlyDistributed}
      tabStyle={evenlyDistributed ? styles.tabBarItemEven : styles.tabBarItem}
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

export default CategoryTabBar;

