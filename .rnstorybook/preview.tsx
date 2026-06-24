import type { Preview } from '@storybook/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <Story />
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          "UI",
          "Cards",
          "Forms",
          "Comments",
          "Lists",
          "Layout",
          "Menus",
          "Media",
          "Modals",
          "Icons",
        ],
      },
    },
  },
};

export default preview;
