import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ArtistCard from "./ArtistCard";

const meta = {
  title: "Cards/ArtistCard",
  component: ArtistCard,
  decorators: [withFullWidth],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof ArtistCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "김아티스트",
    category: "보컬",
    musicNoteCount: 12,
  },
};

export const WithAvatar: Story = {
  args: {
    name: "박뮤지션",
    category: "기타",
    avatarUrl: "https://picsum.photos/seed/artist/200",
    musicNoteCount: 5,
  },
};
