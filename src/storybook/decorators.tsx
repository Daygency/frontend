import type { Decorator } from "@storybook/react-native";
import { View } from "react-native";

const PADDING = 16;

export const withPadding: Decorator = (Story) => (
  <View style={{ padding: PADDING }}>
    <Story />
  </View>
);

export const withFullWidth: Decorator = (Story) => (
  <View style={{ padding: PADDING, width: "100%" }}>
    <Story />
  </View>
);

export const withFabArea: Decorator = (Story) => (
  <View style={{ height: 400, width: "100%" }}>
    <Story />
  </View>
);
