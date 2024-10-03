const path = require('path');

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    watchFiles: ['src/**/*'],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
