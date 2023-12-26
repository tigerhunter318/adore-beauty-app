import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useActionState, useIsLoggedIn } from '../store/utils/stateHook'
import CartEmail from '../screens/login/CartEmail'
import CartLogin from '../screens/login/CartLogin'
import CartSignup from '../screens/login/CartSignup'
import { config, screenOptions } from './utils'
import { onLoginBack } from './utils/loginNavigationHelpers'
import LoginForgotPassword from '../screens/login/LoginForgotPassword'
import LoginResetPassword from '../screens/login/LoginResetPassword'
import customer from '../store/modules/customer'
import LoadingOverlay from '../components/ui/LoadingOverlay'

const Stack = createStackNavigator()

export const loginScreenOptions = ({ title, hasBack = true, onBackPress }) =>
  screenOptions({
    title,
    hasBack,
    onBackPress
  })

export const LoginStack = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch()
  const account = useActionState('customer.account') || {}
  const { email, isGuest, hasGuestOrder, id } = account
  const isLoggedIn = useIsLoggedIn()

  const loginParams = params || {}
  loginParams.email = email

  const onBackPress = async () => {
    await dispatch(customer.actions.account({ ...account, hasGuestOrder: undefined }))
    onLoginBack({ navigation, route: { params: loginParams } })
  }

  const handleLoginBackPress = () => navigation.navigate('Login', { screen: 'CartEmail', goBack: true })

  if (isLoggedIn) return <LoadingOverlay active lipstick />

  return (
    <Stack.Navigator {...config} screen initialRouteName="CartEmail">
      {(loginParams.goBack || !email || (!!email && !(isGuest || hasGuestOrder || id))) && (
        <Stack.Screen
          name="CartEmail"
          component={CartEmail}
          initialParams={loginParams}
          options={loginScreenOptions({ title: 'SIGN IN', onBackPress })}
        />
      )}
      <Stack.Screen
        name="CartSignup"
        component={CartSignup}
        initialParams={loginParams}
        options={loginScreenOptions({ title: 'SIGN UP', onBackPress: handleLoginBackPress })}
      />
      <Stack.Screen
        name="CartLogin"
        component={CartLogin}
        initialParams={loginParams}
        options={loginScreenOptions({ title: 'SIGN IN', onBackPress: handleLoginBackPress })}
      />
      <Stack.Screen
        name="LoginForgotPassword"
        component={LoginForgotPassword}
        initialParams={loginParams}
        options={loginScreenOptions({ title: 'FORGOT PASSWORD', onBackPress: handleLoginBackPress })}
      />
      <Stack.Screen
        name="LoginResetPassword"
        component={LoginResetPassword}
        initialParams={loginParams}
        options={loginScreenOptions({ title: 'RESET PASSWORD', onBackPress: handleLoginBackPress })}
      />
    </Stack.Navigator>
  )
}
