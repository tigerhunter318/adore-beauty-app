// https://github.com/wix/Detox/blob/master/examples/demo-react-native/detox.config.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  artifacts: {
    plugins: {
      uiHierarchy: 'enabled'
    }
  },
  configurations: {
    'ios.sim.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Adore Beauty.app',
      build:
        'xcodebuild -workspace ios/AdoreBeauty.xcworkspace -configuration Debug -scheme AdoreBeauty -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        type: 'iPhone 12'
      }
    },
    'ios.sim.release': {
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/Adore Beauty.app',
      build:
        'xcodebuild -workspace ios/AdoreBeauty.xcworkspace -configuration Release -scheme AdoreBeauty -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        type: 'iPhone 12'
      }
    }
  }
}
