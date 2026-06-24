import type { Meta, StoryObj } from "@storybook/react-native";
import { withFullWidth } from "../../../storybook/decorators";
import ShadowCardListFaqItem from "./ShadowCardListFaqItem";

const meta = {
  title: "Lists/ShadowCardListFaqItem",
  component: ShadowCardListFaqItem,
  decorators: [withFullWidth],
} satisfies Meta<typeof ShadowCardListFaqItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: "회원가입은 어떻게 하나요?",
    answer:
      "앱 하단의 마이페이지에서 회원가입 버튼을 눌러 이메일 또는 소셜 계정으로 가입할 수 있습니다.",
  },
};
