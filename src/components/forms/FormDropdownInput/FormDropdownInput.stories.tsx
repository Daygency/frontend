import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import FormDropdownInput from "./FormDropdownInput";

const SAMPLE_DATA = [
  { label: "보컬", value: "vocal" },
  { label: "기타", value: "guitar" },
  { label: "드럼", value: "drums" },
  { label: "피아노", value: "piano" },
];

const meta = {
  title: "Forms/FormDropdownInput",
  component: FormDropdownInput,
  decorators: [withFullWidth],
  args: {
    data: SAMPLE_DATA,
    onChange: fn(),
  },
} satisfies Meta<typeof FormDropdownInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "전공을 선택하세요",
  },
};

export const Selected: Story = {
  args: {
    placeholder: "전공을 선택하세요",
    value: "vocal",
  },
};

export const WithError: Story = {
  args: {
    placeholder: "전공을 선택하세요",
    hasError: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "선택 불가",
    disable: true,
  },
};
