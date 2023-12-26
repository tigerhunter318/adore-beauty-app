import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'

/*
 * catch goBack event and override with navigation back to previous route with params
 */
const useGoBackParams = (props: any) => {
  const navigation = useNavigation()
  const route = useRoute<any>()

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', evt => {
      const isGoBackEvent = evt?.data?.action?.type === 'GO_BACK'
      const fromScreenPath = route?.params?.fromScreenPath
      const previousRoute = navigation.dangerouslyGetState().routes[navigation.dangerouslyGetState().index - 1]
      if (!fromScreenPath && isGoBackEvent && previousRoute) {
        evt.preventDefault()
        unsubscribe()
        navigation.navigate(previousRoute.name, props)
      }
    })

    return unsubscribe
  }, [props])

  return null
}

export default useGoBackParams
