import Toast from 'react-native-root-toast'
import { isSmallDevice } from '../utils/device'

const bottomHeight = isSmallDevice() ? 40 : 80

const defaultShowOptions = {
  duration: Toast.durations.LONG,
  position: Toast.positions.BOTTOM - bottomHeight,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
  onShow: () => {
    // calls on toast\`s appear animation start
  },
  onShown: () => {
    // calls on toast\`s appear animation end.
  },
  onHide: () => {
    // calls on toast\`s hide animation start.
  },
  onHidden: () => {
    // calls on toast\`s hide animation end.
  }
}

const show = (title, options = {}) => Toast.show(title, { ...defaultShowOptions, ...options })

export default {
  show
}
