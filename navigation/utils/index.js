import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect } from 'react'
import { CardStyleInterpolators } from '@react-navigation/stack'
import { useRoute } from '@react-navigation/core'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import Header from '../../components/ui/Header'
import { getActiveTabState } from './navigationUtils'
import { isIos } from '../../utils/device'

/**
 * catch back button requests in parent screen header and navigate child back
 *
 * @param deps
 */
export const useScreenBack = deps => {
  const [navigation] = deps
  const handleNavigationBack = evt => {
    evt.preventDefault()
    navigation.removeListener('beforeRemove', handleNavigationBack)
    navigation.goBack()
  }

  const handleScreenFocus = () => {
    navigation.addListener('beforeRemove', handleNavigationBack)
    return () => {
      navigation.removeListener('beforeRemove', handleNavigationBack)
    }
  }
  return useScreenFocusEffect(handleScreenFocus, deps)
}

export const withNavigation = WrappedComponent => ({ children, ...props }) => {
  const navigation = useNavigation()
  return (
    <WrappedComponent navigation={navigation} {...props}>
      {children}
    </WrappedComponent>
  )
}

export const withScreenOptions = (HeaderComponent, headerProps = {}) => ({
  header: props => (HeaderComponent ? <HeaderComponent {...props} {...headerProps} /> : null),
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  gestureDirection: 'horizontal'
})

export const config = {
  headerMode: 'screen',
  mode: 'card',
  screenOptions: { headerShown: true, animationEnabled: isIos() }
}
export const screenOptions = headerProps => withScreenOptions(Header, headerProps)
export const noHeaderScreenOptions = withScreenOptions(null)

export const useScreenHeaderTitle = title => {
  const navigation = useNavigation()

  return useEffect(() => {
    if (title) {
      navigation.setParams({ screenHeaderTitle: title })
    }
  }, [navigation, title])
}

export const useScreenHeader = (header = props => {}, deps) => {
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      header
    })
  }, deps || [navigation])
}
