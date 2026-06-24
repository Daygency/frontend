import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import FormTextInput from "./FormTextInput";

const meta = {
  title: "Forms/FormTextInput",
  component: FormTextInput,
  decorators: [withFullWidth],
  args: {
    onChangeText: fn(),
  },
} satisfies Meta<typeof FormTextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    placeholder: "활동명",
    value: "데이전시",
  },
};

export const WithError: Story = {
  args: {
    placeholder: "이메일",
    value: "invalid",
    hasError: true,
  },
};
