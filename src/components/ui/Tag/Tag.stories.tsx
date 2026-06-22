import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import Tag from "./Tag";

const meta = {
  title: "UI/Tag",
  component: Tag,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Type: Story = {
  args: {
    text: "보컬",
    variant: "type",
  },
};

export const Status: Story = {
  args: {
    text: "모집중",
    variant: "status",
  },
};

export const Reaction: Story = {
  args: {
    text: "좋아요 12",
    variant: "reaction",
  },
};

export const CustomColors: Story = {
  args: {
    text: "커스텀",
    variant: "type",
    borderColor: "#1F2A44",
    backgroundColor: "#F5F5F5",
    textColor: "#1F2A44",
    borderRadius: 8,
  },
};
