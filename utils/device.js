import { Platform, Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const { width, height } = Dimensions.get('window')

export const isiPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896)

export const isSmallDevice = () => width < 375

export const isAndroid = () => Platform.OS === 'android'
export const isIos = () => Platform.OS === 'ios'

export const isNotchedDevice = () => isiPhoneX()

export const deviceName = () => DeviceInfo.getModel()

export const osVersion = () => parseFloat(Platform.Version)

export const osName = () => Platform.OS

export const isHermesEnabled = () => !!global.HermesInternal

export const isTablet = () => DeviceInfo.isTablet()
