import type { Meta, StoryObj } from "@storybook/react-native";
import { withPadding } from "../../../storybook/decorators";
import NewBadge from "./NewBadge";

const meta = {
  title: "UI/NewBadge",
  component: NewBadge,
  decorators: [withPadding],
} satisfies Meta<typeof NewBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
