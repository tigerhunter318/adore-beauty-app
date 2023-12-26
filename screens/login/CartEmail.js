import React from 'react'
import { useDispatch } from 'react-redux'
import { useSmartlookSensitiveRef } from 'smartlook-react-native-wrapper'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import useForm from '../../components/form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import FormField from '../../components/form/FormField'
import CustomButton from '../../components/ui/CustomButton'
import customer from '../../store/modules/customer'
import SocialLogin from '../../components/social-login/SocialLogin'
import ZendeskChat from '../../components/zendesk/ZendeskChat'
import SafeScreenView from '../../components/ui/SafeScreenView'
import VersionInfo from '../../components/ui/VersionInfo'
import FooterHyperLinks from '../../components/ui/FooterHyperLinks'
import envConfig from '../../config/envConfig'

const CartEmail = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const emailRef = useSmartlookSensitiveRef(false)
  const form = useForm({ email: route?.params?.email })

  const handleNext = async () => {
    form.setSubmitted(true)

    if (form.isValid()) {
      const values = form.getValues()
      values.email = values.email.toLowerCase()

      const params = {
        ...values,
        goBack: route?.params?.goBack,
        next: route?.params?.next
      }

      const response = await dispatch(customer.actions.verifyEmail({ email: values.email }))
      if (response?.data) {
        if (response?.data?.bigcommerce_exists || response?.data?.magento_exists) {
          navigation.push('CartLogin', { ...response.data, ...params })
        } else {
          navigation.push('CartSignup', { ...response.data, ...params })
        }
      } else {
        navigation.push('CartSignup', params)
      }
    }
  }

  return (
    <SafeScreenView flex={1} scroll>
      <Container ph={2} pv={2} flex={1} testID="CartSignIn">
        <Container mb={2}>
          <Type bold size={25} mb={1}>
            Let's get you signed in
          </Type>
        </Container>
        <Container mb={2}>
          <Type bold heading size={14} mb={1}>
            Enter Email Address
          </Type>
        </Container>
        <Container mb={2}>
          <FormField
            required
            fieldType="email"
            name="email"
            form={form}
            inputRef={emailRef}
            placeholder="Email"
            onSubmitEditing={handleNext}
            testID="CartSignIn.email"
          />
        </Container>

        <Container>
          <CustomButton
            bold
            inactive={!form.isValid()}
            fontSize={16}
            pv={1}
            loading={isPending}
            width={150}
            onPress={handleNext}
          >
            Next
          </CustomButton>
        </Container>
      </Container>
      <Container>
        <SocialLogin navigation={navigation} route={route} />
      </Container>
      {envConfig.enableZendesk && (
        <Container pt={3} ph={2}>
          <ZendeskChat />
        </Container>
      )}
      <Container pt={1.6} pb={3} ph={4} rows justify>
        <FooterHyperLinks />
      </Container>
      <VersionInfo />
    </SafeScreenView>
  )
}

export default CartEmail
