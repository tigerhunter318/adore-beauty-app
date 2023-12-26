import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomModal from '../ui/CustomModal'
import CustomButton from '../ui/CustomButton'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import addressUtil from '../../utils/addressUtil'
import AddressList from './AddressList'
import { isSmallDevice } from '../../utils/device'
import { useActionState } from '../../store/utils/stateHook'
import DefaultAddress from './DefaultAddress'
import Icon from '../ui/Icon'
import { AddNewAddressButton } from './NewAddress'
import LoadingOverlay from '../ui/LoadingOverlay'
import Hr from '../ui/Hr'
import theme from '../../constants/theme'
import customer from '../../store/modules/customer'
import { isValidObject } from '../../utils/validation'

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 10
  },
  hr: {
    backgroundColor: theme.splitorColor,
    height: 0.3,
    marginBottom: 10,
    marginTop: 20
  }
})

const ShippingAddressListModal = ({
  isVisible,
  onClose,
  onAddressChange,
  addresses,
  newAddress,
  initialAddress = null,
  onModalHide,
  onClearAddressInput,
  onNewAddressSelection,
  firstName,
  lastName,
  defaultPhone,
  form
}) => {
  const [activeAddressIndex, setActiveAddressIndex] = useState(null)
  const filteredAddresses = addressUtil.filterInvalidAddresses(addresses) || []
  const hasSavedAddresses = !!filteredAddresses?.length
  const isPending = useActionState('customer.request.pending')
  const dispatch = useDispatch()

  const handleAddressPress = async ({ selectedAddressIndex, address, shouldSaveAsDefaultAddress }) => {
    if (isValidObject(address) && shouldSaveAsDefaultAddress) {
      address.is_default_shipping = true

      await dispatch(
        customer.actions.updateCustomeDefaultAddress({
          address
        })
      )
    }

    if (selectedAddressIndex === null || selectedAddressIndex === undefined) {
      onNewAddressSelection()
      setActiveAddressIndex(null)
    } else if (address.id === filteredAddresses?.[activeAddressIndex]?.id) {
      return null
    } else {
      setActiveAddressIndex(selectedAddressIndex === activeAddressIndex ? null : selectedAddressIndex)
    }
  }

  const handleAddressChange = ({ address, activeIndex }) => {
    const formattedSavedAddress = addressUtil.formatSavedAddress(address, {
      phone: form.getValue('phone') || defaultPhone,
      firstName,
      lastName
    })

    onAddressChange({ formattedSavedAddress, activeIndex })
  }

  const handleApply = () => {
    if (activeAddressIndex === null && !!newAddress) {
      handleAddressChange({
        address: newAddress,
        activeIndex: activeAddressIndex
      })
    } else {
      handleAddressChange({
        address: filteredAddresses?.[activeAddressIndex],
        activeIndex: activeAddressIndex
      })
    }
  }

  const onMount = () => setActiveAddressIndex(initialAddress)

  useEffect(onMount, [initialAddress])

  return (
    <CustomModal isVisible={isVisible} onClose={() => onClose(false)} onModalHide={() => onModalHide()}>
      <LoadingOverlay active={isPending} lipstick />
      <Container pb={2} flex={1}>
        <ScrollView>
          <Container flex={1}>
            <Container style={styles.titleContainer}>
              <AdoreSvgIcon name="address" width={25} height={25} />
              <Type bold style={styles.title}>
                Addresses
              </Type>
            </Container>
            <Container>
              {newAddress || hasSavedAddresses ? (
                <DefaultAddress
                  onClearAddressInput={onClearAddressInput}
                  newAddress={newAddress}
                  customerAddresses={filteredAddresses}
                  selectedAddressIndex={activeAddressIndex}
                  onAddressPress={handleAddressPress}
                />
              ) : (
                <Container rows pt={4} ph={2} center>
                  <Icon name="ios-search" type="ion" size={24} />
                  <Type pl={1} semiBold heading center letterSpacing={1} size={16}>
                    New address
                  </Type>
                </Container>
              )}
              <AddNewAddressButton onPress={() => onClose(true)} containerStyle={{ marginTop: 30 }} />
              <Hr style={styles.hr} />
              {!!hasSavedAddresses && (
                <Container mb={1} mt={0}>
                  <AddressList
                    onAddressItemPress={handleAddressPress}
                    disabled={isPending}
                    hasSelection
                    initialAddress={activeAddressIndex}
                    addresses={filteredAddresses}
                  />
                </Container>
              )}
            </Container>
          </Container>
        </ScrollView>
        {hasSavedAddresses || newAddress ? (
          <CustomButton
            label="Apply"
            disabled={isPending}
            onPress={handleApply}
            pv={1.5}
            ml={2}
            mr={2}
            fontSize={16}
            bold
          />
        ) : null}
      </Container>
    </CustomModal>
  )
}

export default ShippingAddressListModal
