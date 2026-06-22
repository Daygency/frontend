import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { MAIN } from "../../../color";
import HighlightText from "./HighlightText";

const meta = {
  title: "UI/HighlightText",
  component: HighlightText,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HighlightText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "데이전시 공연 티켓 문의드립니다",
    query: "공연",
    style: { fontSize: 16, color: "#000" },
    highlightStyle: { fontWeight: "700", color: MAIN.DEFAULT },
  },
};

export const NoMatch: Story = {
  args: {
    text: "안녕하세요",
    query: "공연",
    style: { fontSize: 16, color: "#000" },
  },
};
