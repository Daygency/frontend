import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withPadding } from "../../../storybook/decorators";
import MajorTagFilter from "./MajorTagFilter";

const meta = {
  title: "Modals/MajorTagFilter",
  component: MajorTagFilter,
  decorators: [withPadding],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof MajorTagFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    selectedValues: [],
  },
};

export const WithSelection: Story = {
  args: {
    selectedValues: ["보컬", "기타", "드럼"],
  },
};
