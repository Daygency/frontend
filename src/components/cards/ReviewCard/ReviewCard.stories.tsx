import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ReviewCard from "./ReviewCard";

const meta = {
  title: "Cards/ReviewCard",
  component: ReviewCard,
  decorators: [withFullWidth],
  args: {
    onOptionsPress: fn(),
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    author: "이데이",
    date: "2025.09.20",
    title: "공연 후기 — 정말 감동적이었습니다",
    content: "무대 연출과 음향이 훌륭했고, 아티스트의 라이브 실력이 인상적이었습니다.",
    reactionTag: "좋아요 12",
    tags: [{ text: "보컬", variant: "type" }],
  },
};

export const TitleOnly: Story = {
  args: {
    title: "짧은 후기 제목만 있는 경우",
  },
};
