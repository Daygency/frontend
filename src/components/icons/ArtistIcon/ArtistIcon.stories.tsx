import type { Meta, StoryObj } from "@storybook/react-native";
import { withPadding } from "../../../storybook/decorators";
import ArtistIcon from "./ArtistIcon";

const meta = {
  title: "Icons/ArtistIcon",
  component: ArtistIcon,
  decorators: [withPadding],
} satisfies Meta<typeof ArtistIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    width: 80,
    height: 80,
  },
};
