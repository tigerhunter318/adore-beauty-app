import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { openExternalUrl } from './openExternalUrl'

const defaultOptions = {
  // iOS Properties
  dismissButtonStyle: 'close',
  preferredBarTintColor: '#000000',
  preferredControlTintColor: 'white',
  readerMode: false,
  animated: true,
  // modalPresentationStyle: 'fullScreen',
  modalPresentationStyle: 'pageSheet',
  // automatic/none/fullScreen/pageSheet/formSheet/currentContext/custom/overFullScreen/overCurrentContext/popover

  modalTransitionStyle: 'coverVertical',
  modalEnabled: true,
  enableBarCollapsing: false,
  // Android Properties
  showTitle: true,
  toolbarColor: '#000000',
  secondaryToolbarColor: 'black',
  enableUrlBarHiding: false,
  enableDefaultShare: false,
  forceCloseOnRedirection: false,
  // Specify full animation resource identifier(package:anim/name)
  // or only resource name(in case of animation bundled with app).
  animations: {
    startEnter: 'slide_in_right',
    startExit: 'slide_out_left',
    endEnter: 'slide_in_left',
    endExit: 'slide_out_right'
  },
  headers: {
    'my-custom-header': 'my custom header value'
  }
}

const openInAppBrowser = async (url, options = {}) => {
  if ((await InAppBrowser.isAvailable()) && url) {
    const result = await InAppBrowser.open(url, { ...defaultOptions, options })
    return result
  }
  if (url) {
    await openExternalUrl(url)
  }
}

export default openInAppBrowser
