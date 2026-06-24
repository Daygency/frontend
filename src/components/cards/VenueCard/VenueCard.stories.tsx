import type { Meta, StoryObj } from "@storybook/react-native";
import { withFullWidth } from "../../../storybook/decorators";
import VenueCard from "./VenueCard";

const meta = {
  title: "Cards/VenueCard",
  component: VenueCard,
  decorators: [withFullWidth],
} satisfies Meta<typeof VenueCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "블루스퀘어",
    address: "서울특별시 용산구 이태원로 294",
    bookmarkCount: 128,
    tags: ["콘서트홀", "대형", "주차 가능"],
  },
};
