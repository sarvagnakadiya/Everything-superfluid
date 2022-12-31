module.exports = function override(config, env) {
  const webpack = require("webpack");
  console.log("override");
  let loaders = config.resolve;
  loaders.fallback = {
    fs: false,
    tls: false,
    net: false,
    http: require.resolve("stream-http"),
    https: false,
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    crypto: require.resolve("crypto-browserify"),
    constants: require.resolve("constants-browserify"),
    buffer: require.resolve("buffer/"),
    os: require.resolve("os-browserify/browser"),
    https: require.resolve("https-browserify"),
  };
  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};
