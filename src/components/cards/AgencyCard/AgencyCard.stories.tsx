import type { Meta, StoryObj } from "@storybook/react-native";
import { withFullWidth } from "../../../storybook/decorators";
import AgencyCard from "./AgencyCard";

const meta = {
  title: "Cards/AgencyCard",
  component: AgencyCard,
  decorators: [withFullWidth],
} satisfies Meta<typeof AgencyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "데이전시 에이전시",
    likes: 42,
    rating: 4.8,
    calendarCount: 12,
    bookmarkCount: 89,
    tags: ["기획사", "캐스팅", "매니지먼트"],
  },
};

export const WithImages: Story = {
  args: {
    title: "뮤직 프로덕션",
    likes: 18,
    rating: 4.5,
    calendarCount: 6,
    bookmarkCount: 34,
    tags: ["프로덕션", "녹음"],
    images: [
      "https://picsum.photos/seed/agency1/320/240",
      "https://picsum.photos/seed/agency2/320/240",
    ],
  },
};
