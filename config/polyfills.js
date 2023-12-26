import { Platform } from 'react-native'

const init = () => {
  /* eslint-disable */
if (global.HermesInternal) {
  if (Platform.OS === 'ios') {
    // Polyfills required to use Intl with Hermes engine
    require('@formatjs/intl-getcanonicallocales/polyfill').default
    require('@formatjs/intl-locale/polyfill').default
    require('@formatjs/intl-pluralrules/polyfill').default
    require('@formatjs/intl-pluralrules/locale-data/en').default
    require('@formatjs/intl-numberformat/polyfill').default
    require('@formatjs/intl-numberformat/locale-data/en').default
    require('@formatjs/intl-datetimeformat/polyfill').default
    require('@formatjs/intl-datetimeformat/locale-data/en').default
    require('@formatjs/intl-datetimeformat/add-all-tz').default
  } else {
    require('@formatjs/intl-getcanonicallocales/polyfill')
    require('@formatjs/intl-locale/polyfill')
    require('@formatjs/intl-datetimeformat/polyfill')
    require('@formatjs/intl-datetimeformat/locale-data/en')
    require('@formatjs/intl-datetimeformat/add-all-tz')
  }
}
  /* eslint-enable */
}

export const polyfills = {
  init
}
