/**
 * global jest mocks
 * @example https://github.com/invertase/react-native-firebase/blob/main/jest.setup.ts
 */

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native/Libraries/Animated/Easing')
jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

/* package functions */
jest.mock('@react-native-async-storage/async-storage', () => ({}))
jest.mock('react-native-track-player', () => ({}))
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: jest.fn()
}))
jest.mock('react-native-device-info', () => ({}))

/* package components */
jest.mock('react-native-modal', () => 'react-native-modal')
jest.mock('react-native-auto-height-image', () => 'react-native-auto-height-image')

/* app components */
jest.mock('./components/ui/Icon', () => 'Icon')
jest.mock('./components/ui/AdoreSvgIcon', () => 'AdoreSvgIcon')

jest.mock('react-native-localize', () => ({
  getTimeZone: () => 'Australia/Melbourne'
}))

jest.mock('react-native-branch', () => {
  const REACT_NATIVE = jest.requireActual('react-native')
  REACT_NATIVE.NativeModules.RNBranch = {
    logEvent: jest.fn(() => true),
    STANDARD_EVENT_ADD_TO_CART: 'ADD_TO_CART'
  }
  const originalModule = jest.requireActual('react-native-branch')
  const mockedModule = {
    __esModule: true,
    ...originalModule,
    createBranchUniversalObject1: async () => ({ ident: 'mock' })
  }

  mockedModule.BranchEvent.ViewCart = 'VIEW_CART'
  mockedModule.BranchEvent.InitiatePurchase = 'INITIATE_PURCHASE'
  mockedModule.BranchEvent.AddToCart = 'ADD_TO_CART'
  mockedModule.BranchEvent.Purchase = 'PURCHASE'
  mockedModule.BranchEvent.ViewItem = 'VIEW_ITEM'
  mockedModule.BranchEvent.CompleteRegistration = 'COMPLETE_REGISTRATION'
  mockedModule.BranchEvent.Login = 'LOGIN'
  mockedModule.BranchEvent.ViewItems = 'VIEW_ITEMS'
  mockedModule.default.createBranchUniversalObject = jest.fn(() => ({
    ident: 'MOCK-IDENT'
  }))
  return mockedModule
})

jest.mock('./services/useRemoteConfig', () => {
  const { defaults } = jest.requireActual('./services/useRemoteConfig')
  const getRemoteConfigItem = key => defaults[key]
  return {
    getRemoteConfigItem,
    getRemoteConfigNumber: key => Number(getRemoteConfigItem(key)),
    getRemoteConfigBoolean: key => Boolean(getRemoteConfigItem(key)),
    getRemoteConfigJson: key => JSON.parse(getRemoteConfigItem(key))
  }
})
