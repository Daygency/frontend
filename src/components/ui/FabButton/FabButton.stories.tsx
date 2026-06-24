import type { Meta, StoryObj } from "@storybook/react-native";
import { fn } from "storybook/test";
import { withFabArea } from "../../../storybook/decorators";
import FabButton from "./FabButton";
import { CONTENT_REGISTRATION_FAB_MENU_LABELS } from "./contentRegistrationFabMenu";

const meta = {
  title: "UI/FabButton",
  component: FabButton,
  decorators: [withFabArea],
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof FabButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {};

export const WithMenu: Story = {
  args: {
    menuItems: [
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.announcement,
        onPress: fn(),
      },
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.musicNews,
        onPress: fn(),
      },
      {
        label: CONTENT_REGISTRATION_FAB_MENU_LABELS.community,
        onPress: fn(),
      },
    ],
  },
};
