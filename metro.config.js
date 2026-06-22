const {
  withStorybook,
} = require('@storybook/react-native/withStorybook');

const { getDefaultConfig } = require("expo/metro-config");

const config = (() => {
  const baseConfig = getDefaultConfig(__dirname);
  const { transformer, resolver } = baseConfig;

  baseConfig.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  baseConfig.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return baseConfig;
})();

module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === "true",
});
