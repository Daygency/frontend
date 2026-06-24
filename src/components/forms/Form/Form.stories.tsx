import type { Meta, StoryObj } from "@storybook/react-native";
import { ComponentProps } from "react";
import { withFullWidth } from "../../../storybook/decorators";
import Form from "./Form";
import FormTextInput from "../FormTextInput";

type FormStoryProps = Omit<ComponentProps<typeof Form>, "children"> & {
  inputPlaceholder?: string;
};

function FormStory({
  inputPlaceholder = "입력하세요",
  hasError,
  ...formProps
}: FormStoryProps) {
  return (
    <Form {...formProps} hasError={hasError}>
      <FormTextInput placeholder={inputPlaceholder} hasError={hasError} />
    </Form>
  );
}

const meta = {
  title: "Forms/Form",
  component: FormStory,
  decorators: [withFullWidth],
} satisfies Meta<typeof FormStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    isRequired: true,
    title: "활동명",
    example: "예) 데이전시",
  },
};

export const WithError: Story = {
  args: {
    isRequired: true,
    title: "이메일",
    hasError: true,
  },
};

export const Optional: Story = {
  args: {
    isRequired: false,
    title: "소개",
    inputPlaceholder: "선택 입력",
  },
};
