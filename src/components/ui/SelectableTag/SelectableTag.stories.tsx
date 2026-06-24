import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withPadding } from "../../../storybook/decorators";
import SelectableTag from "./SelectableTag";

const meta = {
  title: "UI/SelectableTag",
  component: SelectableTag,
  decorators: [withPadding],
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
