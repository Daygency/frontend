import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import GrayCard from "./GrayCard";

const meta = {
  title: "Cards/GrayCard",
  component: GrayCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    onPressItem: fn(),
  },
} satisfies Meta<typeof GrayCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        boardName: "자유게시판",
        latestPost: "오늘 공연 후기 올립니다",
        communityId: "1",
        hasNew: true,
      },
      {
        boardName: "팀원모집",
        latestPost: "기타리스트 구합니다",
        communityId: "2",
        hasNew: false,
      },
    ],
  },
};
