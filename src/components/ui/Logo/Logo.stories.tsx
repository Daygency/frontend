import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import Logo from "./Logo";

const meta = {
  title: "UI/Logo",
  component: Logo,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logoName: "daygency",
    size: 24,
  },
};

export const WithSubtitle: Story = {
  args: {
    logoName: "daygency",
    size: 24,
    subtitle: "음악 커뮤니티",
  },
};
