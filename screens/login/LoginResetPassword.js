import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import useForm from '../../components/form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import CustomButton from '../../components/ui/CustomButton'
import FormInputPassword, { formInputPasswordErrorText } from '../../components/form/FormInputPassword'
import customer from '../../store/modules/customer'
import { deviceName } from '../../utils/device'
import SafeScreenView from '../../components/ui/SafeScreenView'
import { onLoginSuccess } from '../../navigation/utils/loginNavigationHelpers'
import { useScreenBack } from '../../navigation/utils'

const ResetPasswordForm = ({ navigation, route, onSuccess }) => {
  const { params } = route

  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const form = useForm({
    id: params.id,
    token: params.token,
    email: params.email
  })

  useScreenBack([navigation])

  const handleSubmit = async () => {
    form.setSubmitted(true)
    if (form.isValid()) {
      const payload = {
        ...form.getValues()
      }
      const data = await dispatch(customer.actions.resetPassword(payload))
      if (data) {
        onSuccess(data.message, form.getValues())
      }
    }
  }

  return (
    <Container flex={1} ph={2} pv={2}>
      <Container mb={2}>
        <Type bold heading size={14} mb={1} lineHeight={20} pr={2}>
          Reset Password
        </Type>
        <Type lineHeight={20}>{formInputPasswordErrorText()}</Type>
      </Container>
      <Container mb={2}>
        <FormInputPassword required name="password" form={form} placeholder="Password" containerProps={{ mb: 1 }} />
        <FormInputPassword
          required
          name="password_confirmation"
          form={form}
          placeholder="Confirm Password"
          onSubmitEditing={handleSubmit}
        />
      </Container>

      <CustomButton bold fontSize={16} pv={1.5} disabled={isPending} onPress={handleSubmit} loading={isPending}>
        Submit
      </CustomButton>
    </Container>
  )
}

const LoginResetPassword = ({ navigation, route }) => {
  const [completeMessage, setCompleteMessage] = useState(null)
  const [formData, setFormData] = useState(null)
  const dispatch = useDispatch()
  const { params } = route
  const handleResetSuccess = (msg, data) => {
    setCompleteMessage(msg)
    setFormData(data)
  }

  const handleLogin = async () => {
    const payload = { ...formData }
    payload.device_name = deviceName()
    const data = await dispatch(customer.actions.login(payload))

    if (data && data.token) {
      onLoginSuccess({
        navigation,
        route: {
          params: {
            next: {
              screen: 'MainTab',
              params: {
                screen: 'Account'
              }
            }
          }
        }
      })
    }
  }

  return (
    <SafeScreenView flex={1} scroll>
      {completeMessage && (
        <Container flex={1} ph={2} pv={2}>
          <Type mb={1} lineHeight={20}>
            {completeMessage}
          </Type>
          <CustomButton onPress={handleLogin} width={180}>
            Login
          </CustomButton>
        </Container>
      )}
      {!completeMessage && <ResetPasswordForm navigation={navigation} route={route} onSuccess={handleResetSuccess} />}
    </SafeScreenView>
  )
}

export default LoginResetPassword
