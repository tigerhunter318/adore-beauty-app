import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import md5 from 'react-native-uuid/src/md5'
import { useScreenRouter } from '../router/screenRouter'
import logInfo from '../../utils/logInfo'

const useGoBackToScreenPath = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const activeKeyRef = useRef(0)
  const { navigateScreen } = useScreenRouter()

  const getNavigationStateHashKey = () => md5(JSON.stringify(navigation.dangerouslyGetState()))

  useEffect(() => {
    activeKeyRef.current = getNavigationStateHashKey()
    const unsubscribe = navigation.addListener('beforeRemove', evt => {
      const isGoBackEvent = evt?.data?.action?.type === 'GO_BACK'
      const fromScreenPath = route?.params?.fromScreenPath
      if (fromScreenPath && isGoBackEvent && activeKeyRef.current === getNavigationStateHashKey()) {
        logInfo('purple', `caught back event in ${route.name} with fromScreenPath`, fromScreenPath)
        navigation.setParams({ fromScreenPath: undefined, parentScreenPath: undefined })
        navigation.pop() // remove current screen
        evt.preventDefault()
        navigateScreen(fromScreenPath, { fromScreenPath: undefined, parentScreenPath: undefined }, 'NAVIGATE')
      }
    })

    return unsubscribe
  }, [navigation, route])

  return null
}

export default useGoBackToScreenPath
