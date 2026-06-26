import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import AnnouncementCard from "./AnnouncementCard";

const meta = {
  title: "Cards/AnnouncementCard",
  component: AnnouncementCard,
  decorators: [withFullWidth],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof AnnouncementCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "2025 서울 콩쿠르 보컬 부문 참가자 모집",
    type: "콩쿨(경연)",
    status: "모집중",
    daysLeft: 12,
    authorName: "데이전시",
    address: "서울 서초구 예술의전당",
    viewCount: 128,
  },
};

export const WithPrice: Story = {
  args: {
    title: "재즈 페스티벌 세션 뮤지션 모집",
    type: "공연",
    status: "모집중",
    daysLeft: 5,
    priceType: "INCOME",
    price: 500000,
    showNew: true,
    authorName: "재즈클럽",
    viewCount: 42,
  },
};

export const DeadlinePassed: Story = {
  args: {
    title: "모집 마감된 공고 예시",
    status: "모집중",
    daysLeft: -1,
    authorName: "작성자",
  },
};
