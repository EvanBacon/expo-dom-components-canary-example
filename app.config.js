module.exports = ({ config }) => {
  if (process.env.CUSTOM_RUN === "1") {
    delete config.sdkVersion;
  }

  return config;
};
