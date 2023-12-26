import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import ShippingAddressModal from '../../components/address/ShippingAddressModal'
import Container from '../../components/ui/Container'
import Type from '../../components/ui/Type'
import AdoreSvgIcon from '../../components/ui/AdoreSvgIcon'
import useForm from '../../components/form/useForm'
import { useActionState } from '../../store/utils/stateHook'
import customer from '../../store/modules/customer'
import AddressList from '../../components/address/AddressList'
import NewAddress from '../../components/address/NewAddress'
import addressUtil from '../../utils/addressUtil'
import { isValidArray, isValidName, isValidObject } from '../../utils/validation'
import { getIn } from '../../utils/getIn'
import { useScreenFocusEffect } from '../../hooks/useScreen'
import { vh } from '../../utils/dimensions'
import LoadingOverlay from '../../components/ui/LoadingOverlay'

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 10
  },
  savedAddressesContainer: {
    flexDirection: 'row',
    paddingVertical: 28,
    alignItems: 'center',
    marginLeft: 20
  },
  savedAddressesTitle: {
    paddingLeft: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 15
  },
  containerStyle: {
    marginLeft: 20,
    marginRight: 20
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: vh(50)
  }
})

const AccountAddresses = () => {
  const [newAddress, setNewAddress] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const form = useForm()
  const dispatch = useDispatch()
  const account = useActionState('customer.account')
  const isPending = useActionState('customer.request.pending')
  const customerAddresses = useActionState('customer.addresses')
  const firstName = isValidName(getIn(account, 'first_name')) ? getIn(account, 'first_name') : ''
  const lastName = isValidName(getIn(account, 'last_name')) ? getIn(account, 'last_name') : ''
  const phone = getIn(account, 'default_phone') || ''

  const handleModal = position => setIsModalVisible(position)

  const handleCancelNewAddress = () => setNewAddress(null)

  const handleAddressChange = ({ metaData, type }) => {
    if (type === 'result:select') {
      const formattedNewAddress = addressUtil.formatNewAddress(metaData)
      const shippingAddressIndex = addressUtil.getShippingAddressIndex(metaData, savedAddresses)

      if (shippingAddressIndex === -1) {
        setNewAddress({ ...formattedNewAddress })
      }

      handleModal()
    }
  }

  const handleSaveNewAddress = async () => {
    form.setSubmitted(true)

    if (form.isValid()) {
      await dispatch(
        customer.actions.saveAddress({
          ...newAddress,
          phone: form.getValue('phone') || phone,
          first_name: form.getValue('firstName'),
          last_name: form.getValue('lastName'),
          isNewAddress: true
        })
      )
      form.setValue({ phone, firstName, lastName })
      setNewAddress(null)
      await dispatch(customer.actions.fetchCustomerAddresses())
    }
  }

  const handleSetAddressFromState = () => {
    if (customerAddresses?.length !== savedAddresses?.length) {
      const sortedFetchedAddresses = addressUtil.sortAddresses(customerAddresses)
      const formattedSavedAddresses = sortedFetchedAddresses?.map(address =>
        addressUtil.formatSavedAddress(address, {
          phone: address.phone || phone,
          firstName: address.first_name || firstName,
          lastName: address.last_name || lastName
        })
      )

      setSavedAddresses(formattedSavedAddresses?.map(address => address.addressMeta))
    }
  }

  const handleUpdateCustomeDefaultAddress = async ({ address }) => {
    if (isValidObject(address)) {
      address.is_default_shipping = true

      await dispatch(
        customer.actions.updateCustomeDefaultAddress({
          address
        })
      )
    }
  }

  const fetchAddressesOnMount = async () => {
    form.setSubmitted(false)
    form.setFocused('')
    form.setValue({ phone, firstName, lastName })
    await dispatch(customer.actions.fetchCustomerAddresses())
  }

  const handleScreenFocus = () => {
    fetchAddressesOnMount()
  }

  useScreenFocusEffect(handleScreenFocus, [])
  useScreenFocusEffect(handleSetAddressFromState, [customerAddresses])

  return (
    <ScrollView testID="AccountAddressesScreen">
      <Container style={styles.titleContainer}>
        <AdoreSvgIcon name="address" width={25} height={25} />
        <Type bold style={styles.title}>
          Addresses
        </Type>
      </Container>
      <LoadingOverlay active={isPending} containerStyle={{ height: vh(100) }} lipstick />
      {isValidArray(savedAddresses) ? (
        <Container>
          <NewAddress
            form={form}
            newAddress={newAddress}
            onModal={() => handleModal(true)}
            onSaveAddress={handleSaveNewAddress}
            onCancelNewAddress={handleCancelNewAddress}
          />
          <AddressList
            containerStyle={styles.containerStyle}
            isAddressPressable={false}
            onAddressItemPress={handleUpdateCustomeDefaultAddress}
            disabled={isPending}
            addresses={savedAddresses}
            initialAddress={savedAddresses?.length - 1}
            firstName={firstName}
            lastName={lastName}
            defaultPhone={phone}
            form={form}
          />
        </Container>
      ) : (
        <Container>
          <NewAddress
            form={form}
            newAddress={newAddress}
            onModal={() => handleModal(true)}
            onSaveAddress={handleSaveNewAddress}
            onCancelNewAddress={handleCancelNewAddress}
          />
        </Container>
      )}
      <ShippingAddressModal
        onAddressChange={handleAddressChange}
        isVisible={isModalVisible}
        onClose={() => handleModal(false)}
      />
    </ScrollView>
  )
}

export default AccountAddresses
