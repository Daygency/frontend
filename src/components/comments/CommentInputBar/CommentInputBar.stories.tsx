import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import CommentInputBar from "./CommentInputBar";

const meta = {
  title: "Comments/CommentInputBar",
  component: CommentInputBar,
  decorators: [withFullWidth],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof CommentInputBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EditMode: Story = {
  args: {
    editMode: {
      commentId: "1",
      initialContent: "수정할 댓글 내용입니다",
    },
    onCancelEdit: fn(),
  },
};
