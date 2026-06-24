import type { Meta, StoryObj } from "@storybook/react-native";
import { withPadding } from "../../../storybook/decorators";
import AgencyIcon from "./AgencyIcon";

const meta = {
  title: "Icons/AgencyIcon",
  component: AgencyIcon,
  decorators: [withPadding],
} satisfies Meta<typeof AgencyIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    width: 80,
    height: 80,
  },
};
