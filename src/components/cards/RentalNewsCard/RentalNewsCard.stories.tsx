import type { Meta, StoryObj } from "@storybook/react-native";
import { withFullWidth } from "../../../storybook/decorators";
import RentalNewsCard from "./RentalNewsCard";

const meta = {
  title: "Cards/RentalNewsCard",
  component: RentalNewsCard,
  decorators: [withFullWidth],
} satisfies Meta<typeof RentalNewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "연습실 대관 안내",
    venueName: "뮤직스튜디오 A",
    date: "2025.06.24",
  },
};
