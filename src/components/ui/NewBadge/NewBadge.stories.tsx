import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import NewBadge from "./NewBadge";

const meta = {
  title: "UI/NewBadge",
  component: NewBadge,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NewBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
