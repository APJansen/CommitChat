const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/content_script.js',
  output: {
    filename: 'content_script.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup.html', to: 'popup.html' },
        { from: 'src/popup.js', to: 'popup.js' },
        { from: 'src/background.js', to: 'background.js' },
        { from: 'src/styles.css', to: 'styles.css' },
        { from: 'icons', to: 'icons' },
      ],
    }),
  ],
};

