import type { Meta, StoryObj } from "@storybook/react-native";
import { withPadding } from "../../../storybook/decorators";
import CommentAuthorAvatar from "./CommentAuthorAvatar";

const meta = {
  title: "Comments/CommentAuthorAvatar",
  component: CommentAuthorAvatar,
  decorators: [withPadding],
} satisfies Meta<typeof CommentAuthorAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  args: {
    size: 40,
  },
};

export const WithImage: Story = {
  args: {
    size: 40,
    profileImgUrl: "https://picsum.photos/seed/profile/200",
  },
};

export const Small: Story = {
  args: {
    size: 28,
  },
};
