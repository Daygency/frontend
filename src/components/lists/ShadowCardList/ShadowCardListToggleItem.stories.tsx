import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ShadowCardListToggleItem, {
  type ShadowCardListToggleItemProps,
} from "./ShadowCardListToggleItem";

function ToggleStory(args: ShadowCardListToggleItemProps) {
  const [value, setValue] = useState(args.value);
  return (
    <ShadowCardListToggleItem
      {...args}
      value={value}
      onValueChange={setValue}
    />
  );
}

const meta = {
  title: "Lists/ShadowCardListToggleItem",
  component: ShadowCardListToggleItem,
  decorators: [withFullWidth],
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof ShadowCardListToggleItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const On: Story = {
  render: (args) => <ToggleStory {...args} />,
  args: {
    label: "푸시 알림",
    description: "새 소식을 알림으로 받습니다",
    value: true,
  },
};

export const Off: Story = {
  render: (args) => <ToggleStory {...args} />,
  args: {
    label: "마케팅 수신",
    value: false,
    isLast: true,
  },
};

export const Disabled: Story = {
  render: (args) => <ToggleStory {...args} />,
  args: {
    label: "사용 불가 옵션",
    value: false,
    disabled: true,
  },
};
