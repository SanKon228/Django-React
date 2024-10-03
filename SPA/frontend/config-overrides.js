module.exports = function override(config, env) {
    config.devServer = {
      ...config.devServer,
      hot: true,
      watchOptions: {
        poll: true,
      },
      host: '0.0.0.0',
      port: 3000,
    };
    return config;
  };
  