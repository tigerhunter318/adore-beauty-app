import React, { useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/core'
import { alertError, parseApiErrorMessage } from '../../store/api'
import theme from '../../constants/theme'
import FormInputPassword from '../form/FormInputPassword'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import Type from '../ui/Type'
import customer from '../../store/modules/customer'
import CustomModal from '../ui/CustomModal'
import LoadingOverlay from '../ui/LoadingOverlay'
import useForm from '../form/useForm'
import { useActionState } from '../../store/utils/stateHook'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    borderTopColor: theme.black,
    borderBottomWidth: 0,
    marginTop: 20,
    paddingTop: 15,
    paddingHorizontal: 10
  },
  deleteText: {
    marginBottom: 30,
    marginTop: 15,
    letterSpacing: 0.5,
    color: theme.lightBlack
  }
})

const AccountProfileCloseAccount = ({ account }) => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const isPending = useActionState('customer.request.pending')
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const form = useForm(null)
  const password = form?.getValue('password')

  const onError = error => {
    const { status } = error.response
    if (status === 422) {
      const title = parseApiErrorMessage(error) || 'Error'
      Alert.alert(title.replace('.', ''), `\nPlease check your details and try again`)
    } else {
      alertError(error)
    }
  }

  const handleCloseAccount = async () => {
    const requestConfig = { onError }
    const success = await dispatch(customer.actions.deleteAccount(account.id, password, requestConfig))

    if (success) {
      navigation.navigate('Home')
    }
  }

  const handlePasswordModal = () => {
    setIsPasswordModalVisible(!isPasswordModalVisible)
    if (isPasswordModalVisible) {
      form.reset()
    }
  }
  const handleCloseAccountAlert = () => {
    Alert.alert(
      'Close this account',
      '\n Are you sure you want to close this account and delete its associated data? Please note this action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {}
        },
        {
          text: 'Yes',
          onPress: () => handlePasswordModal()
        }
      ],
      {
        cancelable: false
      }
    )
  }

  return (
    <Container>
      <Container style={styles.section}>
        <Type style={styles.deleteText}>
          I would like to{' '}
          <Type bold color={theme.black}>
            close
          </Type>{' '}
          my account with Adore Beauty and delete the associated personal data related to this account.
        </Type>
      </Container>
      <CustomButton
        pv={1.5}
        semiBold
        background={theme.black}
        color={theme.white}
        borderColor={theme.black}
        borderWidth={0}
        onPress={handleCloseAccountAlert}
      >
        Close this account
      </CustomButton>
      <CustomModal isVisible={isPasswordModalVisible} onClose={handlePasswordModal} containerStyle={{ maxHeight: 260 }}>
        <LoadingOverlay active={isPending} lipstick />
        <Container justify ph={2}>
          <Type size={16} center mt={2} heading semiBold>
            Close account
          </Type>
          <Type mt={2} mb={2} color={theme.lighterBlack}>
            Please re-enter your password to confirm this action
          </Type>
          <FormInputPassword
            name="password"
            isLoginPassword
            errorMessage={() => 'Enter a valid password'}
            form={form}
            width="77%"
            lockIconStyles={{ top: 9 }}
            eyeIconStyles={{ top: 6 }}
          />
          <CustomButton
            pv={1.5}
            mt={2}
            semiBold
            background={theme.black}
            color={theme.white}
            borderColor={theme.black}
            borderWidth={0}
            onPress={handleCloseAccount}
            disabled={!form.isValid()}
          >
            Close this account
          </CustomButton>
        </Container>
      </CustomModal>
    </Container>
  )
}

export default AccountProfileCloseAccount
