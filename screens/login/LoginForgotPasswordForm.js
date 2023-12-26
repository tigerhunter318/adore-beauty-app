import React from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import { useActionState } from '../../store/utils/stateHook'
import { useScreenBack } from '../../navigation/utils'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import useForm from '../../components/form/useForm'
import CustomButton from '../../components/ui/CustomButton'
import FormField from '../../components/form/FormField'
import customer from '../../store/modules/customer'
import theme from '../../constants/theme'
import Icon from '../../components/ui/Icon'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: theme.lightBlack,
    width: 60,
    height: 60,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    textAlign: 'center',
    paddingVertical: 30,
    color: theme.lightBlack
  },
  formContainer: {
    marginBottom: 20
  },
  formLabel: {
    textTransform: 'uppercase',
    marginBottom: 10,
    fontSize: 12
  }
})

const LoginForgotPasswordForm = ({ navigation, route, onResetSuccess }) => {
  const dispatch = useDispatch()
  const isPending = useActionState('customer.request.pending')
  const { params } = route
  const form = useForm({ email: params?.email })

  useScreenBack([navigation])

  const handleSubmit = async () => {
    form.setSubmitted(true)
    if (form.isValid()) {
      const payload = { ...form.getValues() }
      const data = await dispatch(customer.actions.forgotPassword(payload))

      if (data?.message) {
        onResetSuccess(data.message)
      }
    }
  }

  return (
    <Container>
      <Container style={styles.container}>
        <Container style={styles.iconContainer}>
          <Icon name="email" type="materialcommunityicons" size={35} color={theme.white} />
        </Container>
        <Type style={styles.message}>Enter your email address and we will send you a link to reset your password.</Type>
      </Container>
      <Container style={styles.formContainer}>
        <Type semiBold style={styles.formLabel}>
          email address
        </Type>
        <FormField
          required
          fieldType="email"
          name="email"
          form={form}
          nextName="password"
          placeholder="Email"
          containerProps={{ mb: 1 }}
        />
      </Container>
      <CustomButton bold fontSize={16} pv={1.5} disabled={isPending} onPress={handleSubmit} loading={isPending}>
        Submit
      </CustomButton>
    </Container>
  )
}

export default LoginForgotPasswordForm
