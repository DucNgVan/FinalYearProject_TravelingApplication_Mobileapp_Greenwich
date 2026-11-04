// Setup env shim for Jest with React Native 0.86
try {
  const { NativeModules } = require('react-native');
  if (NativeModules && NativeModules.StatusBarManager) {
    NativeModules.StatusBarManager.setNetworkActivityIndicatorVisible = jest.fn();
    NativeModules.StatusBarManager.setColor = jest.fn();
    NativeModules.StatusBarManager.setStyle = jest.fn();
    NativeModules.StatusBarManager.setHidden = jest.fn();
  }
} catch (e) {}

try {
  const NativeStatusBarManagerIOS = require('react-native/src/private/specs_DEPRECATED/modules/NativeStatusBarManagerIOS').default;
  if (NativeStatusBarManagerIOS) {
    NativeStatusBarManagerIOS.setNetworkActivityIndicatorVisible = jest.fn();
  }
} catch (e) {}

// Proper mock for react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children, style, ...props }) => React.createElement(View, { style, ...props }, children),
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children, style, ...props }) => React.createElement(View, { style, ...props }, children),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

module.exports = {};
