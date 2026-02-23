const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withRemoveBundleCompression(config) {
  return withAppBuildGradle(config, (config) => {
    if (!config.modResults || !config.modResults.contents) {
      return config;
    }
    // remove any line setting enableBundleCompression inside project.ext.react
    const contents = config.modResults.contents;
    const updated = contents.replace(
      /\s*enableBundleCompression\s*=\s*.*\r?\n/,
      "",
    );
    config.modResults.contents = updated;
    return config;
  });
};
