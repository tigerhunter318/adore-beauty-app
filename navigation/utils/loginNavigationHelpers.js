import { isValidObject } from '../../utils/validation'

/**
 * navigate back to previous screen on success or to Cart is goBack is false
 *
 * @param navigation
 * @param route
 */
export const onLoginSuccess = ({ navigation, route }) => {
  const { goBack, next } = route?.params || {}

  const closeLoginModal = () => {
    navigation.goBack()
    navigation.goBack()
  }

  if (goBack) {
    if (route.name === 'CartEmail') {
      navigation.goBack()
    } else {
      closeLoginModal()
    }
  } else if (isValidObject(next)) {
    const { screen, params } = next

    closeLoginModal()
    navigation.navigate(screen, params)
  }
}

export const onLoginBack = ({ navigation, route }) => {
  const { goBack } = route?.params || {}

  if (goBack) {
    navigation.goBack()
  } else {
    navigation.navigate('Shop')
  }
}
