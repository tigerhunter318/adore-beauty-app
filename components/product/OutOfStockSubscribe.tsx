import React, { useState, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { vh, vw } from '../../utils/dimensions'
import { useActionState } from '../../store/utils/stateHook'
import { alertError } from '../../store/api'
import { isIos, isSmallDevice } from '../../utils/device'
import CustomModal from '../ui/CustomModal'
import Type from '../ui/Type'
import useForm from '../form/useForm'
import FormField from '../form/FormField'
import cart from '../../store/modules/cart'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Icon from '../ui/Icon'

type OutOfStockSubscribeProps = {
  id: number
  productUrl: string
  baseVariantId: number
  isVisible: boolean
  onClose: () => void
  isListingView: boolean
}

const OutOfStockSubscribe = ({
  id,
  productUrl,
  baseVariantId,
  isVisible,
  onClose,
  isListingView
}: OutOfStockSubscribeProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const dispatch = useDispatch()
  const account = useActionState('customer.account')
  const hasAccount = !!(account && account.id)
  const email = (hasAccount && account.email) || null
  const initialValues = { email }
  const form = useForm(initialValues)
  const scrollViewRef = useRef<ScrollView>(null)
  const isFormValid = form.isValid()

  const handleSubmit = () => {
    if (isFormValid) {
      subscribeToWaitlist(form.getValue('email'))
    }
  }

  const handleNameChange = (name: any, val: any) => {
    if (val) {
      form.setValue({ email: val })
    }
  }

  const handleReset = () => {
    form.setValue({ ...initialValues })
    setIsSuccessful(false)
    if (isVisible && scrollViewRef?.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 200)
    }
  }

  useEffect(handleReset, [isVisible])

  const subscribeToWaitlist = async (userEmail: string) => {
    setIsLoading(true)

    try {
      if (userEmail && baseVariantId && id && productUrl) {
        const data = await dispatch(
          cart.actions.subscribeToWaitlist({ userEmail, epi: baseVariantId, empi: id, du: productUrl })
        )
        if (data) {
          setIsSuccessful(true)
        }
      }
    } catch (error) {
      alertError(error)
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    onClose()
    setOffset(0)
  }

  let styles: any = {
    innerModalContainer: {
      marginLeft: 0,
      marginBottom: 0,
      paddingBottom: 70
    },
    outterModalContainer: {
      position: 'absolute',
      bottom: isSmallDevice() ? -vh(65) : -vh(60),
      paddingBottom: 100,
      width: vw(100)
    }
  }

  if (!isIos()) {
    styles.outterModalContainer = {
      position: 'absolute',
      bottom: 0,
      paddingBottom: 0,
      width: vw(100)
    }
  }

  if (isListingView) {
    styles = {
      innerModalContainer: { marginBottom: 0, marginTop: 30 },
      outterModalContainer: {}
    }
  }

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={handleClose}
      backdropOpacity={0.3}
      style={styles.innerModalContainer}
      containerStyle={styles.outterModalContainer}
      offset={offset}
      slideAnimation={!isListingView && isIos()}
    >
      <KeyboardAwareScrollView
        onKeyboardWillShow={(frames: any) => setOffset(frames.endCoordinates.height)}
        onKeyboardWillHide={() => setOffset(0)}
      >
        <ScrollView
          style={{
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: theme.white
          }}
          ref={scrollViewRef}
        >
          <Type size={22} pt={6} letterSpacing={1.5} lineHeight={30} bold center pb={4}>
            Notify me when this item is back in stock
          </Type>
          <FormField
            fieldType="email"
            name="email"
            form={form}
            placeholder="Enter email address"
            onSubmitEditing={handleSubmit}
            onChange={handleNameChange}
          />
          <CustomButton
            style={{
              backgroundColor: isSuccessful ? '#dff1bf' : theme.lightGrey,
              alignItems: 'center'
            }}
            pv={1.2}
            pl={0}
            mt={1.5}
            mb={3}
            disabled={!isFormValid || isSuccessful}
            onPress={handleSubmit}
          >
            {isSuccessful ? (
              <Container center rows>
                <Icon name="check" type="materialcommunityicons" size={18} color={theme.green} />
                <Type heading semiBold pl={1} letterSpacing={1} color="#4f8a0f">
                  Added
                </Type>
              </Container>
            ) : (
              <Container rows>
                <AdoreSvgIcon name="email" height={18} width={16} />
                <Type pl={1} letterSpacing={1} semiBold heading color={theme.black}>
                  {isLoading ? 'please wait ...' : 'notify me'}
                </Type>
              </Container>
            )}
          </CustomButton>
        </ScrollView>
      </KeyboardAwareScrollView>
    </CustomModal>
  )
}

export default OutOfStockSubscribe
