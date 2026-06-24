import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFabArea } from "../../../storybook/decorators";
import FabButton from "./FabButton";

const meta = {
  title: "UI/FabButton",
  component: FabButton,
  decorators: [withFabArea],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof FabButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {};

export const WithMenu: Story = {
  args: {
    menuItems: [
      { label: "모집공고", onPress: fn() },
      { label: "음악계 소식", onPress: fn() },
      { label: "커뮤니티", onPress: fn() },
    ],
  },
};
