module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '^~(.+)': './src/\\1',
        },
      },
    ],
    'react-native-reanimated/plugin',
    'react-native-boost/plugin',
  ],
};
