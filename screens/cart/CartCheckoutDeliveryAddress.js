import React, { useState, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { getIn } from '../../utils/getIn'
import { useActionState, useIsLoggedIn } from '../../store/utils/stateHook'
import { isValidName, isValidObject } from '../../utils/validation'
import { isIos } from '../../utils/device'
import { tealiumEvents } from '../../services/tealium'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import FormField, { toMaskedPhoneNumber } from '../../components/form/FormField'
import cart, {
  useCart,
  useCartLineItems,
  useCartItemsProductDetail,
  useCheckoutErrorAlert
} from '../../store/modules/cart'
import customer from '../../store/modules/customer'
import CartPriceBar from '../../components/cart/CartPriceBar'
import Container from '../../components/ui/Container'
import ShippingAddressModal from '../../components/address/ShippingAddressModal'
import ShippingAddressListModal from '../../components/address/ShippingAddressListModal'
import FieldSet from '../../components/ui/FieldSet'
import ScreenInputView from '../../components/ui/ScreenInputView'
import useForm from '../../components/form/useForm'
import SafeScreenView from '../../components/ui/SafeScreenView'
import DeliveryAddress from '../../components/address/DeliveryAddress'
import addressUtil from '../../utils/addressUtil'
import Loading from '../../components/ui/Loading'
import Type from '../../components/ui/Type'
import theme from '../../constants/theme'
import { parseApiErrorMessage } from '../../store/api'

const CartCheckoutDeliveryAddress = ({ navigation }) => {
  const [savedAddresses, setSavedAddresses] = useState([])
  const [shippingAddresses, setShippingAddresses] = useState([])
  const [initialAddressIndex, setInitialAddressIndex] = useState(null)
  const [isAddressModalActive, setIsAddressModalActive] = useState(false)
  const [hasToShowAddressModal, setHasToShowAddressModal] = useState(false)
  const [isAddressListModalActive, setIsAddressListModalActive] = useState(false)
  const form = useForm()
  const cartDetails = useCart()
  const lineItems = useCartLineItems()
  const cartItemsProductDetail = useCartItemsProductDetail()
  const dispatch = useDispatch()
  const phoneInputRef = useRef(null)
  const account = useActionState('customer.account')
  const customerAddresses = useActionState('customer.addresses')
  const isPending = useActionState('customer.request.pending')
  const billingAddress = useActionState('cart.billingAddress')
  const isLoggedIn = useIsLoggedIn()
  const checkoutErrorAlert = useCheckoutErrorAlert()

  const firstName = isValidName(getIn(account, 'first_name')) ? getIn(account, 'first_name') : ''
  const lastName = isValidName(getIn(account, 'last_name')) ? getIn(account, 'last_name') : ''
  const phone = getIn(account, 'default_phone') || ''
  const hasAddressError = form.submitted && !form.getValue('address')
  const hasSavedAddresses = !!savedAddresses?.length

  const handleModalClose = () => setIsAddressModalActive(false)
  const handleAddressModalOpen = () => setIsAddressModalActive(true)
  const handleAddressListModalOpen = () => setIsAddressListModalActive(true)
  const handleModalHide = () => hasToShowAddressModal && handleAddressModalOpen()
  const handleAddressListModalClose = (showAddressSelectionModal = false) => {
    setIsAddressListModalActive(false)
    setHasToShowAddressModal(showAddressSelectionModal)
  }
  const toggleSaveAddress = () => {
    form.setValue({
      isSaveAddressChecked: !form.getValue('isSaveAddressChecked')
    })
  }

  const handleAddressChange = ({ fullAddress, metaData, type }) => {
    if (type === 'result:select') {
      const formattedNewAddress = addressUtil.formatNewAddress(metaData, {
        phone,
        firstName,
        lastName
      })
      const shippingAddressIndex = addressUtil.getShippingAddressIndex(metaData, shippingAddresses)
      const { firstName: firstNameOnForm, lastName: lastNameOnForm, phone: phoneOnForm } = form.getValues()

      form.setValue({
        address: fullAddress,
        addressMeta: metaData,
        newAddress: { ...formattedNewAddress },
        firstName: firstName || firstNameOnForm,
        lastName: lastName || lastNameOnForm,
        phone: phone || phoneOnForm
      })

      setInitialAddressIndex(shippingAddressIndex === -1 ? null : shippingAddressIndex)
      form.setFocused('')
      handleModalClose()
    }
  }

  const handleNewAddressSelection = () => setInitialAddressIndex(null)

  const handleAddressChangeFromList = ({ formattedSavedAddress, activeIndex }) => {
    const { first_name, last_name } = formattedSavedAddress?.addressMeta || {}

    form.setValue({
      ...formattedSavedAddress,
      isSaveAddressChecked: false,
      firstName: first_name,
      lastName: last_name,
      phone: formattedSavedAddress?.phone
        ? toMaskedPhoneNumber(formattedSavedAddress.phone)
        : phone || form.getValue('phone')
    })

    form.setFocused('')
    setInitialAddressIndex(activeIndex)
    handleAddressListModalClose()
  }

  const updateInvalidNames = async () => {
    const payload = {}
    if (form.getValue('firstName') !== firstName && !isValidName(getIn(account, 'first_name'))) {
      payload.first_name = form.getValue('firstName')
    }

    if (form.getValue('lastName') !== lastName && !isValidName(getIn(account, 'last_name'))) {
      payload.last_name = form.getValue('lastName')
    }

    if (Object.entries(payload).length) {
      payload.id = getIn(account, 'id')
      await dispatch(customer.actions.updateCustomer(payload))
    }
  }

  const updateCustomerAddressDetails = async () => {
    const { firstName: firstNameOnForm, lastName: lastNameOnForm, phone: phoneOnForm } = form.getValues()
    const addressOnForm = savedAddresses[initialAddressIndex]
    const newAddress = form.getValue('newAddress')
    let userAddress = addressOnForm

    if (form.getValue('isSaveAddressChecked')) {
      userAddress = newAddress || addressOnForm
      setInitialAddressIndex(0)
    }

    const addressPayload = {
      ...userAddress,
      first_name: firstNameOnForm || userAddress.first_name,
      last_name: lastNameOnForm || userAddress.last_name,
      phone: phoneOnForm || userAddress.phone
    }

    if (userAddress) {
      await dispatch(
        customer.actions.saveAddress({
          ...addressPayload,
          isNewAddress: !!newAddress
        })
      )
    }
  }

  const handleNextPress = async () => {
    form.setSubmitted(true)

    if (!account?.email) return navigation.push('Login', { goBack: true })

    if (form.getValue('address')) {
      const onError = error => {
        const message = parseApiErrorMessage(error)
        const errorCode = error?.response?.status

        if (errorCode) {
          if (errorCode !== 403 && errorCode !== 429) {
            checkoutErrorAlert()
          } else {
            alert(message)
          }
        } else {
          alert('Invalid address format, please selecting a different address.')
        }
      }

      const payload = {
        address: form.getValues(),
        requestConfig: { onError }
      }

      const data = await dispatch(cart.actions.addAddress(payload))

      if (isValidObject(data)) {
        if (isLoggedIn) {
          await updateInvalidNames()
          await updateCustomerAddressDetails()
        }

        if (data.id && getIn(data, 'billing_address.id')) {
          navigation.push('CartCheckoutDeliveryOptions')
        }
      }
    }
  }

  const handleClearAddressInput = () => {
    form.setValue({ address: '', newAddress: '' })
    setInitialAddressIndex(savedAddresses?.length ? savedAddresses.length - 1 : null)
    fetchCustomersAddresses()
  }

  const sortAndSaveAddresses = addresses => {
    const sortedAddresses = addressUtil.sortAddresses(addresses)
    const formattedAndSortedAddresses = sortedAddresses?.map(address =>
      addressUtil.formatSavedAddress(address, {
        phone,
        firstName,
        lastName
      })
    )

    setSavedAddresses(formattedAndSortedAddresses?.map(address => address.addressMeta))

    return formattedAndSortedAddresses
  }

  const fetchCustomersAddresses = async () => {
    if (isLoggedIn) {
      const fetchedAddresses = await dispatch(customer.actions.fetchCustomerAddresses())

      if (fetchedAddresses) {
        return sortAndSaveAddresses(fetchedAddresses)
      }
    }
  }

  const fillInputForm = address => {
    if (address) {
      setShippingAddresses(address)
      const { first_name, last_name, phone: savedPhone } = address?.addressMeta || address?.newAddress || {}

      form.setValue({
        ...address,
        firstName: address?.firstName || first_name || firstName,
        lastName: address?.lastName || last_name || lastName,
        phone: address?.phone || savedPhone || phone,
        newAddress: address?.newAddress || '',
        isSaveAddressChecked: false
      })

      const addressMeta = address?.addressMeta || address?.newAddress || {}

      tealiumEvents.checkoutApp(
        {
          ...cartDetails,
          billing_address: {
            ...addressMeta,
            first_name: address?.firstName || first_name || firstName,
            last_name: address?.lastName || last_name || lastName
          }
        },
        lineItems,
        1,
        cartItemsProductDetail
      )
    } else {
      tealiumEvents.checkoutApp(
        {
          ...cartDetails,
          billing_address: {
            first_name: firstName,
            last_name: lastName
          }
        },
        lineItems,
        1,
        cartItemsProductDetail
      )
      form.setValue({ address: '', firstName, lastName, phone })
    }
  }

  const handleSetAddressFromState = () => {
    if (isLoggedIn && account) {
      if (savedAddresses?.length === customerAddresses?.length) return

      const formattedAndSortedAddresses = sortAndSaveAddresses(customerAddresses)

      const billingAddressIndex = addressUtil.findBillingAddressIndex(formattedAndSortedAddresses, billingAddress)

      if (billingAddressIndex === -1 && billingAddress && billingAddress?.newAddress) {
        fillInputForm(billingAddress)
        setInitialAddressIndex(null)
      } else if (billingAddressIndex !== -1 && billingAddress) {
        billingAddress.newAddress = null
        fillInputForm(billingAddress)
        setInitialAddressIndex(billingAddressIndex)
      } else {
        fillInputForm(formattedAndSortedAddresses?.[0])
        setInitialAddressIndex(0)
      }
    } else if (billingAddress) {
      fillInputForm(billingAddress)
      setInitialAddressIndex(null)
    }
  }

  const fetchAddressesOnMount = async () => {
    form.setSubmitted(false)
    form.setFocused('')
    await fetchCustomersAddresses()
  }

  const handleScreenFocus = () => {
    fetchAddressesOnMount()
  }

  useScreenFocusEffect(handleScreenFocus, [])
  useScreenFocusEffect(handleSetAddressFromState, [customerAddresses, billingAddress])

  if (isPending) return <Loading lipstick />

  return (
    <SafeScreenView flex={1}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ScreenInputView enabled={isIos()} keyboardVerticalOffset={-60}>
          <DeliveryAddress
            onModalOpen={hasSavedAddresses ? handleAddressListModalOpen : handleAddressModalOpen}
            toggleSaveAddress={toggleSaveAddress}
            hasAddressError={hasAddressError}
            form={form}
            initialAddressIndex={initialAddressIndex}
            isUserLoggedIn={isLoggedIn}
          />
          <Container pb={6}>
            <FieldSet ph={0} ml={2} mr={2}>
              <FormField
                fieldType="name"
                label="First Name"
                required
                name="firstName"
                testID="CartCheckoutDeliveryAddress.firstName"
                form={form}
                nextName="lastName"
                condensed
                errorMessage={() => 'Enter a valid First Name so we can ensure correct delivery of your package'}
              />
            </FieldSet>
            <FieldSet ph={0} ml={2} mr={2}>
              <FormField
                fieldType="name"
                label="Last Name"
                required
                name="lastName"
                testID="CartCheckoutDeliveryAddress.lastName"
                form={form}
                nextName="phone"
                condensed
                errorMessage={() => 'Enter a valid Last Name so we can ensure correct delivery of your package'}
              />
            </FieldSet>
            <FieldSet ph={0} ml={2} mr={2}>
              <FormField
                fieldType="phone"
                label="Contact Phone"
                name="phone"
                testID="CartCheckoutDeliveryAddress.phone"
                required
                form={form}
                inputRef={phoneInputRef}
                placeholder="0400 000 000"
                nextName="address"
                condensed
              />
            </FieldSet>
            <FieldSet ph={0} ml={2} mr={2}>
              <FormField label="Company" name="company" form={form} condensed />
            </FieldSet>
            <Type left ph={2} pv={2} size={12} color={theme.darkRed} semiBold>
              * Required fields
            </Type>
          </Container>
        </ScreenInputView>
      </ScrollView>
      <CartPriceBar
        data={cartDetails}
        buttonLabel="Add Delivery Address"
        buttonTestID="CartCheckoutDeliveryAddress.ButtonDeliveryOptions"
        onButtonPress={handleNextPress}
        buttonDisabled={!form.isValid()}
      />
      <ShippingAddressModal
        onAddressChange={handleAddressChange}
        isVisible={isAddressModalActive}
        onClose={handleModalClose}
      />
      <ShippingAddressListModal
        onClearAddressInput={handleClearAddressInput}
        onAddressChange={handleAddressChangeFromList}
        isVisible={isAddressListModalActive}
        onClose={handleAddressListModalClose}
        addresses={savedAddresses}
        initialAddress={initialAddressIndex}
        onNewAddressSelect={handleAddressModalOpen}
        onModalHide={handleModalHide}
        newAddress={form.getValue('newAddress')}
        onNewAddressSelection={handleNewAddressSelection}
        firstName={firstName}
        lastName={lastName}
        defaultPhone={phone}
        form={form}
      />
    </SafeScreenView>
  )
}

export default CartCheckoutDeliveryAddress
