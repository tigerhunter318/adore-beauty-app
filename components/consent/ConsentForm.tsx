import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import customer from '../../store/modules/customer'

const ConsentForm = ({ onAgree }: { onAgree?: any }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handleConfirm = async () => {
    await dispatch(customer.actions.storeConsentGiven(1))

    if (onAgree) {
      onAgree()
    }
  }

  const onMount = () => {
    Alert.alert(
      'We want to make sure you’re comfortable',
      'This page contains sex devices and accessories (including product images, reviews, and product information including usage guides). Would you like to continue?',
      [
        {
          text: 'Yes',
          onPress: handleConfirm
        },
        {
          text: 'No',
          onPress: navigation.goBack
        }
      ]
    )
  }

  useScreenFocusEffect(onMount)

  return null
}

export default ConsentForm
