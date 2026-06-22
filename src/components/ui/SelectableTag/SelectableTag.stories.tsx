import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import SelectableTag from "./SelectableTag";

const meta = {
  title: "UI/SelectableTag",
  component: SelectableTag,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof SelectableTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "전체",
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    label: "보컬",
    selected: true,
  },
};
