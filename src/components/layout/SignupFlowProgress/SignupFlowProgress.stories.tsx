import type { Meta, StoryObj } from "@storybook/react-native";
import { withPadding } from "../../../storybook/decorators";
import SignupFlowProgress from "./SignupFlowProgress";

const meta = {
  title: "Layout/SignupFlowProgress",
  component: SignupFlowProgress,
  decorators: [withPadding],
} satisfies Meta<typeof SignupFlowProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Step1: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
  },
};

export const Step2: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
  },
};

export const Step3: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
  },
};
