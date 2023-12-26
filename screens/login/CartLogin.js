import React from 'react'
import { useDispatch } from 'react-redux'
import { useSmartlookSensitiveRef } from 'smartlook-react-native-wrapper/lib/commonjs'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import useForm from '../../components/form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import CustomButton from '../../components/ui/CustomButton'
import FormField from '../../components/form/FormField'
import FormInputPassword from '../../components/form/FormInputPassword'
import customer from '../../store/modules/customer'
import { deviceName } from '../../utils/device'
import SocialLogin from '../../components/social-login/SocialLogin'
import SafeScreenView from '../../components/ui/SafeScreenView'
import { onLoginSuccess } from '../../navigation/utils/loginNavigationHelpers'
import SocietyCheckBox from '../../components/society/SocietyCheckBox'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'

const CartLogin = ({ navigation, route }) => {
  const { params } = route
  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const isSocietyMember = useActionState('customer.request.data.data.has_joined_loyalty')
  const emailRef = useSmartlookSensitiveRef(false)
  const form = useForm({ email: params.email })

  const handleSubmit = async () => {
    form.setSubmitted(true)
    if (form.isValid()) {
      const payload = { ...form.getValues() }
      payload.device_name = deviceName()
      const data = await dispatch(customer.actions.login(payload))
      if (data && data.token) {
        if (payload.join_loyalty === 1) {
          emarsysEvents.trackJoinAdoreSociety()
        }

        onLoginSuccess({ navigation, route })
      }
    }
  }

  const handlePress = () => navigation.push('LoginForgotPassword', params)

  return (
    <SafeScreenView flex={1} scroll>
      <Container flex={1} ph={2} pv={2} testID="CartLogin">
        <Container mb={2}>
          <Type bold heading size={14} mb={0} lineHeight={20} pr={2}>
            Looks like you’re an existing customer
          </Type>
        </Container>
        <Container mb={2}>
          <FormField
            fieldType="email"
            name="email"
            testID="CartLogin.email"
            form={form}
            inputRef={emailRef}
            nextName="password"
            placeholder="Email"
            containerProps={{ mb: 1 }}
          />
          <FormInputPassword
            required
            name="password"
            isLoginPassword
            errorMessage={() => 'Enter a valid password'}
            form={form}
            placeholder="Password"
            testID="CartLogin.password"
            onSubmitEditing={handleSubmit}
          />
        </Container>
        {!isSocietyMember && <SocietyCheckBox showLogo form={form} navigation={navigation} />}
        <CustomButton
          bold
          fontSize={16}
          pv={1.5}
          inactive={!form.isValid()}
          disabled={isPending}
          onPress={handleSubmit}
          loading={isPending}
          mb={1}
          testID="CartLogin.ButtonSignIn"
        >
          Sign In
        </CustomButton>
        <Container center>
          <CustomButton
            onPress={handlePress}
            width={180}
            fontSize={13}
            background="transparent"
            textProps={{ heading: false, underline: true }}
          >
            Forgot password?
          </CustomButton>
        </Container>
      </Container>
      <Container pb={2}>
        <SocialLogin navigation={navigation} route={route} />
      </Container>
    </SafeScreenView>
  )
}

export default CartLogin
