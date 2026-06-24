import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import OneLineTextInput from "./OneLineTextInput";

const meta = {
  title: "Forms/OneLineTextInput",
  component: OneLineTextInput,
  decorators: [withFullWidth],
  args: {
    onChangeText: fn(),
  },
} satisfies Meta<typeof OneLineTextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "한 줄 입력",
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "검색어",
    value: "재즈",
  },
};
