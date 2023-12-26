import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import { isSmallDevice } from '../../utils/device'
import { useActionState } from '../../store/utils/stateHook'
import { AddressLine } from './AddressListItem'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Icon from '../ui/Icon'
import customer from '../../store/modules/customer'
import theme from '../../constants/theme'
import Hr from '../ui/Hr'

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center'
  },
  title: {
    paddingLeft: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 15
  },
  removeContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -7,
    right: -12
  },
  unsavedText: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: theme.darkRed,
    paddingTop: 10
  },
  checkIconContainer: {
    paddingTop: 3,
    paddingRight: 10
  },
  hr: {
    backgroundColor: theme.darkGray,
    height: 0.3,
    marginBottom: 0
  }
})

const DefaultAddress = ({
  newAddress,
  customerAddresses,
  selectedAddressIndex,
  onClearAddressInput = () => {},
  onAddressPress = () => {}
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const isPending = useActionState('customer.request.pending')
  const dispatch = useDispatch()
  const isSavedAddress = !!customerAddresses?.length && selectedAddressIndex !== null

  const handleDeleteAddressPress = async () => {
    if (!isLoading || !isPending) {
      setIsLoading(true)

      if (isSavedAddress) {
        await dispatch(customer.actions.deleteAddress(customerAddresses[selectedAddressIndex].id))
        await dispatch(customer.actions.fetchCustomerAddresses())
      } else {
        onClearAddressInput()
      }

      setIsLoading(false)
      await dispatch(customer.actions.fetchAccount())
    }
  }

  const handleNewAddressPress = () => {
    if (selectedAddressIndex !== null) {
      onAddressPress({ index: null })
    }
  }

  return (
    <Container>
      <Container style={styles.titleContainer}>
        <AdoreSvgIcon name="mail" height={22} width={29} />
        <Type semiBold style={styles.title}>
          Deliver to
        </Type>
      </Container>
      <Container mt={1} ph={2}>
        {isSavedAddress && (
          <Container style={{ width: '100%' }}>
            <Container rows>
              <Container pr={1}>
                <AdoreSvgIcon color="green" name="check-item" width={18} height={18} />
              </Container>
              <AddressLine address={customerAddresses[selectedAddressIndex]} isActive />
            </Container>
            <Container style={styles.removeContainer} onPress={handleDeleteAddressPress}>
              <Icon name="trash" size={28} type="evil" color={theme.lighterBlack} />
            </Container>
          </Container>
        )}
      </Container>
      {!!newAddress && isSavedAddress && <Hr style={styles.hr} full mt={isSmallDevice() ? 0 : 2} />}
      <Container onPress={handleNewAddressPress} ph={2}>
        {!!newAddress && (
          <Container opacity={isSavedAddress ? 0.6 : 1} pt={selectedAddressIndex !== null ? 2 : 0} rows>
            <Container pl={isSavedAddress ? 2 : 0} style={styles.checkIconContainer}>
              {!isSavedAddress && <AdoreSvgIcon color="green" name="check-item" width={18} height={18} />}
            </Container>
            <Container style={{ width: '90%' }}>
              <AddressLine address={newAddress} isActive />
              <Type bold style={styles.unsavedText}>
                (unsaved)
              </Type>
            </Container>
          </Container>
        )}
      </Container>
    </Container>
  )
}

export default DefaultAddress
