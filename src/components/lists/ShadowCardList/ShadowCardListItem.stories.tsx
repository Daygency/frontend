import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ShadowCardListItem from "./ShadowCardListItem";

const meta = {
  title: "Lists/ShadowCardListItem",
  component: ShadowCardListItem,
  decorators: [withFullWidth],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof ShadowCardListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pressable: Story = {
  args: {
    label: "이메일",
    value: "user@example.com",
  },
};

export const Static: Story = {
  args: {
    label: "가입일",
    value: "2025.01.15",
    onPress: undefined,
    isLast: true,
  },
};
