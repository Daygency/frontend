import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withPadding } from "../../../storybook/decorators";
import FilterDropdown from "./FilterDropdown";

const SORT_OPTIONS = ["최신순", "인기순", "조회순"];
const REGION_OPTIONS = ["전체", "서울", "경기", "부산"];

const meta = {
  title: "Menus/FilterDropdown",
  component: FilterDropdown,
  decorators: [withPadding],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof FilterDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "지역",
    options: REGION_OPTIONS,
    selectedValue: "전체",
  },
};

export const SortButton: Story = {
  args: {
    label: "최신순",
    options: SORT_OPTIONS,
    isSortButton: true,
  },
};
