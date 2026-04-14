import { View, Text, Pressable } from "react-native";
import styles from "../CategoryTabBar/styles";
import { MAIN } from "../../color";

export type PortfolioTabRoute = { key: string; title: string };

type Props = {
  routes: PortfolioTabRoute[];
  index: number;
  onIndexChange: (i: number) => void;
};

const PortfolioInlineTabBar = ({ routes, index, onIndexChange }: Props) => {
  return (
    <View style={styles.tabBar}>
      <View style={{ flexDirection: "row" }}>
        {routes.map((r, i) => (
          <Pressable
            key={r.key}
            style={[styles.tabBarItemEven, { position: "relative" }]}
            onPress={() => onIndexChange(i)}
          >
            <Text
              style={[
                styles.tabLabel,
                i === index && styles.tabLabelSelected,
              ]}
            >
              {r.title}
            </Text>
            {i === index ? (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: MAIN.DEFAULT,
                }}
              />
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PortfolioInlineTabBar;
