import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/core'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import Hr from '../ui/Hr'
import GiftCertificateFooter from './GiftCertificateFooter'
import GiftCertificateForm from './GiftCertificateForm'
import Type from '../ui/Type'
import useForm from '../form/useForm'
import GiftCertificateImage from './GiftCertificateImage'
import cart from '../../store/modules/cart'
import { useActionState } from '../../store/utils/stateHook'
import SafeScreenView from '../ui/SafeScreenView'
import GiftCertificatePriceBar from './GiftCertificatePriceBar'
import ScreenInputView from '../ui/ScreenInputView'
import { isIos } from '../../utils/device'
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility'

const styles = StyleSheet.create({
  title: {
    paddingTop: 30,
    paddingLeft: 20,
    fontSize: 22,
    color: theme.black
  }
})

const GiftCertificate = ({ route }) => {
  const form = useForm()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const isPending = useActionState('cart.request.pending')
  const disabled =
    !(form?.getValue('agreeWithNonRefundable') && form?.getValue('agreeWithExpire') && form.isValid()) || isPending
  const giftCertificateOnCart = route?.params?.item
  const { isKeyboardVisible } = useKeyboardVisibility()
  const addedToCart = form.isSubmitted() && !isPending
  let buttonText = 'add to cart'

  if (addedToCart) {
    buttonText = 'added to cart'
  }
  if (isPending) {
    buttonText = 'adding...'
  }

  const handleAddToCartPress = async () => {
    form.setSubmitted(true)

    const {
      giftAmount,
      sendersName,
      sendersEmail,
      recipientsName,
      recipientsEmail,
      message,
      theme: certificateTheme
    } = form.getValues()

    const giftCertificate = {
      name: 'Gift Certificate',
      theme: certificateTheme || 'General',
      amount: giftAmount,
      quantity: 1,
      sender: {
        name: sendersName,
        email: sendersEmail
      },
      recipient: {
        name: recipientsName,
        email: recipientsEmail
      },
      message
    }
    const result = await dispatch(cart.actions.addGiftCertificateAsLineItem(giftCertificate, giftCertificateOnCart))
    if (result?.newGiftCertificate) {
      navigation.setParams({ item: result.newGiftCertificate })
    }
  }

  return (
    <SafeScreenView flex={1} testID="GiftCertificateScreen">
      <ScreenInputView enabled={isIos()} keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <Container>
            <Type bold style={styles.title}>
              Gift Card
            </Type>
          </Container>
          <GiftCertificateImage />
          <Hr full height={1} mb={0} mt={0} />
          <Container ph={2} mb={8}>
            <GiftCertificateForm form={form} giftCertificateOnCart={giftCertificateOnCart} />
            <GiftCertificateFooter
              form={form}
              onAddToCartPress={handleAddToCartPress}
              isPending={isPending}
              disabled={disabled}
              giftCertificateOnCart={giftCertificateOnCart}
              buttonText={buttonText}
            />
          </Container>
        </ScrollView>
      </ScreenInputView>
      {!isKeyboardVisible && (
        <GiftCertificatePriceBar
          form={form}
          onAddToCartPress={handleAddToCartPress}
          isPending={isPending}
          disabled={disabled}
          giftCertificateOnCart={giftCertificateOnCart}
          buttonText={buttonText}
        />
      )}
    </SafeScreenView>
  )
}

export default GiftCertificate
