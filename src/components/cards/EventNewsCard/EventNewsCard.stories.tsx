import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import EventNewsCard from "./EventNewsCard";

const meta = {
  title: "Cards/EventNewsCard",
  component: EventNewsCard,
  decorators: [withFullWidth],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof EventNewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    title: "서울 재즈 페스티벌 2025",
    place: "블루스퀘어",
    dateRange: "2025.07.01 ~ 2025.07.15",
    imageUrl: "https://picsum.photos/seed/event/400/300",
    likeCount: 24,
    commentCount: 8,
    viewCount: 312,
    relativeTimeText: "2시간 전",
    showNew: true,
  },
};

export const WithoutImage: Story = {
  args: {
    title: "이미지 없는 공연 소식 카드",
    place: "예술의전당",
    dateRange: "2025.08.10",
    likeCount: 3,
    viewCount: 56,
  },
};
