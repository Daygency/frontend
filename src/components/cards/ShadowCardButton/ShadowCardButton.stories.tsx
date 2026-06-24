import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ShadowCardButton from "./ShadowCardButton";

const meta = {
  title: "Cards/ShadowCardButton",
  component: ShadowCardButton,
  decorators: [withFullWidth],
  args: {
    onPress: fn(),
    children: <Text>카드 버튼 콘텐츠</Text>,
  },
} satisfies Meta<typeof ShadowCardButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Static: Story = {
  args: {
    onPress: undefined,
    children: <Text>누를 수 없는 카드</Text>,
  },
};
