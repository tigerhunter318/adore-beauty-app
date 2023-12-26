import React from 'react'
import { useDispatch } from 'react-redux'
import { useSmartlookSensitiveRef } from 'smartlook-react-native-wrapper/lib/commonjs'
import { ScrollView, StyleSheet, Alert } from 'react-native'
import Container from '../../components/ui/Container'
import BeRewardedSvg from '../../assets/images/adore-society-be-rewarded.svg'
import customer from '../../store/modules/customer'
import useForm from '../../components/form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import CustomButton from '../../components/ui/CustomButton'
import FormField from '../../components/form/FormField'
import FormInputPassword from '../../components/form/FormInputPassword'
import { deviceName, osName } from '../../utils/device'
import SocialLogin from '../../components/social-login/SocialLogin'
import { onLoginSuccess } from '../../navigation/utils/loginNavigationHelpers'
import SocietyCheckBox from '../../components/society/SocietyCheckBox'
import { emarsysEvents } from '../../services/emarsys/emarsysEvents'
import { isEmail, isValidObject } from '../../utils/validation'
import { SocietyLogo } from '../../components/society/SocietyAssets'
import { px } from '../../utils/dimensions'
import Type from '../../components/ui/Type'
import theme from '../../constants/theme'
import Hr from '../../components/ui/Hr'

const styles = StyleSheet.create({
  createAccountText: {
    fontSize: 13,
    letterSpacing: 0.5,
    lineHeight: 20
  },
  checkBoxMessageTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.orange,
    borderLeftColor: 'transparent',
    left: 5
  },
  checkBoxMessageContainer: {
    backgroundColor: theme.orange,
    paddingVertical: 10
  },
  checkBoxMessageText: {
    textAlign: 'center',
    fontSize: 11,
    color: theme.white
  }
})

const CartSignup = ({ navigation, route }) => {
  const { params } = route
  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const verifyEmailData = useActionState('customer.verifyEmail.data.data')
  const emailRef = useSmartlookSensitiveRef(false)
  const form = useForm({ email: params.email })
  const isFormValid = form.isValid() && form.getValue('join_loyalty') === 1

  const handleSignup = async () => {
    if (form.getValue('join_loyalty') === undefined) {
      form.setValue({ join_loyalty: 0 })
    }
    form.setSubmitted(true)
    if (isFormValid) {
      const payload = {
        ...form.getValues(),
        ...verifyEmailData,
        subscribed_to_newsletter: 1,
        subscribed_to_loyalty: 1,
        subscribed_to_mobile: 1,
        subscribed_to_promotions: 1,
        device_name: deviceName(),
        customer_source: osName(),
        loyalty_source: osName()
      }
      payload.password_confirmation = payload.password
      const customerResponse = await dispatch(customer.actions.signup(payload))
      if (customerResponse?.token) {
        if (payload.join_loyalty === 1) {
          emarsysEvents.trackJoinAdoreSociety()
        }

        onLoginSuccess({ navigation, route })
      }
    }
  }

  const handleGuestLogin = async () => {
    const email = form.getValue('email')

    if (!isEmail(email)) {
      return Alert.alert('Error', 'Please enter a valid email address in order to continue', [
        {
          text: 'OK'
        }
      ])
    }

    const data = await dispatch(customer.actions.verifyEmail({ email }))

    if (isValidObject(data?.data)) {
      const { magento_exists, bigcommerce_exists } = data.data
      const isExistingCustomer = magento_exists || bigcommerce_exists

      if (isExistingCustomer) {
        return Alert.alert('Error', 'This email is already linked to an account', [
          {
            text: 'OK',
            onPress: () => navigation.push('CartEmail', { email })
          }
        ])
      }
    }

    await dispatch(customer.actions.account({ isGuest: true, email }))

    navigation.navigate('Cart')
  }

  const handleLearnMore = () => navigation.push('AdoreSocietyModalScreen')

  return (
    <ScrollView>
      <Container>
        <Container ph={2} pb={2} pt={1}>
          <Container center mb={0}>
            <SocietyLogo width={px(300)} height={px(60)} />
            <Container style={{ top: -10 }}>
              <BeRewardedSvg width={px(200)} />
            </Container>
          </Container>
          <Container mb={2}>
            <Type style={styles.createAccountText}>
              <Type bold>Create an account </Type>
              with us and join Adore Society, our loyalty program that rewards you for being you.{' '}
              <Type underline pt={1} pb={1} onPress={handleLearnMore}>
                Learn more.
              </Type>
            </Type>
          </Container>
          <Container mb={2}>
            <FormField
              required
              fieldType="name"
              name="first_name"
              form={form}
              nextName="last_name"
              placeholder="First name"
              containerProps={{ mb: 1 }}
            />
            <FormField
              required
              fieldType="name"
              name="last_name"
              form={form}
              inputRef={emailRef}
              nextName="email"
              placeholder="Last name"
              containerProps={{ mb: 1 }}
            />
            <FormField
              required
              fieldType="email"
              name="email"
              form={form}
              nextName="password"
              placeholder="Email"
              containerProps={{ mb: 1 }}
            />
            <FormInputPassword
              required
              name="password"
              form={form}
              placeholder="Password"
              onSubmitEditing={handleSignup}
            />
          </Container>
          <SocietyCheckBox marginBottom={1.5} form={form} navigation={navigation} />
          {form.getValue('join_loyalty') === 0 && (
            <Container style={{ top: -15 }}>
              <Container style={styles.checkBoxMessageTriangle} />
              <Container style={styles.checkBoxMessageContainer} mb={1}>
                <Type bold style={styles.checkBoxMessageText}>
                  Sorry, this is required to create a new account.
                </Type>
              </Container>
            </Container>
          )}
          <CustomButton
            bold
            fontSize={16}
            pv={1.5}
            inactive={!isFormValid}
            disabled={isPending}
            onPress={handleSignup}
            loading={isPending}
          >
            Sign up
          </CustomButton>
        </Container>
        <Container>
          <Hr mb={2} />
          <Type center pb={1} semiBold size={16} color={theme.lighterBlack}>
            OR
          </Type>
          <Container ph={2} pv={1}>
            <CustomButton
              background="white"
              bold
              fontSize={14}
              pv={1.5}
              disabled={isPending}
              onPress={handleGuestLogin}
              testID="CartSignup.ButtonGuestContinue"
            >
              Continue as Guest
            </CustomButton>
          </Container>
        </Container>
        <Container pb={2}>
          <SocialLogin navigation={navigation} route={route} />
        </Container>
      </Container>
    </ScrollView>
  )
}

export default CartSignup
