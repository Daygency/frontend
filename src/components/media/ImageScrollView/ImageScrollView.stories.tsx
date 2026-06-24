import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFullWidth } from "../../../storybook/decorators";
import ImageScrollView from "./ImageScrollView";

const meta = {
  title: "Media/ImageScrollView",
  component: ImageScrollView,
  decorators: [withFullWidth],
  args: {
    onCardPress: fn(),
  },
} satisfies Meta<typeof ImageScrollView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    styles: { container: {} },
    width: 160,
    height: 147,
    gap: 8,
  },
};

export const WithText: Story = {
  args: {
    styles: { container: {} },
    width: 200,
    height: 193,
    gap: 12,
    type: "withText",
  },
};
