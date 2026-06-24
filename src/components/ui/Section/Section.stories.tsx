import type { Meta, StoryObj } from "@storybook/react-native";
import { Text } from "react-native";
import { fn } from "storybook/test";
import { withPadding } from "../../../storybook/decorators";
import Section from "./Section";

const meta = {
  title: "UI/Section",
  component: Section,
  decorators: [withPadding],
  args: {
    onPressMore: fn(),
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithMore: Story = {
  args: {
    title: "인기 공고",
    children: <Text>섹션 콘텐츠</Text>,
  },
};

export const WithoutMore: Story = {
  args: {
    title: "추천 아티스트",
    onPressMore: undefined,
    children: <Text>더보기 없는 섹션</Text>,
  },
};
