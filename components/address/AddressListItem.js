import React from 'react'
import { StyleSheet } from 'react-native'
import { isValidObject } from '../../utils/validation'
import { useActionState } from '../../store/utils/stateHook'
import customer from '../../store/modules/customer'
import Container from '../ui/Container'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import Icon from '../ui/Icon'
import Type from '../ui/Type'
import Hr from '../ui/Hr'

const styles = StyleSheet.create({
  addressLineContainer: {
    width: '80%'
  },
  activeAddressLineContainer: {
    position: 'relative',
    flexDirection: 'row',
    flex: 1
  },
  addressLine: {
    paddingTop: 10,
    lineHeight: 20,
    letterSpacing: 0.5
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 3,
    right: 10
  },
  addressContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20
  },
  defaultAddressContainer: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10
  },
  defaultAddressText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center'
  },
  hr: {
    backgroundColor: theme.darkGray,
    height: 0.3,
    marginBottom: 10,
    marginTop: 20
  }
})

export const AddressLine = ({ address, color = theme.black, isActive, ...props }) => {
  if (isValidObject(address)) {
    const { first_name, last_name, street_1, street_2, city, state, post_code } = address

    const fullName = [first_name, last_name].filter(name => !!name).join(' ')
    const streetAddress = [street_1, street_2].filter(name => !!name).join(', ')
    const postAddress = `\n${city} \n${state}, ${post_code}`

    return (
      <Container ml={isActive ? 0 : 1} style={styles.addressLineContainer} {...props}>
        {!!fullName && (
          <Type semiBold letterSpacing={0.5}>
            {fullName}
          </Type>
        )}
        <Type color={color} style={styles.addressLine} size={13}>
          {!!streetAddress && (
            <Type semiBold heading size={14}>
              {streetAddress}
            </Type>
          )}
          {postAddress}
        </Type>
      </Container>
    )
  }
  return null
}

const AddressListRemoveAddressButton = ({ address, disabled, dispatch }) => {
  const handleDeleteAddress = async () => {
    if (!disabled) {
      await dispatch(customer.actions.deleteAddress(address))
    }
  }

  return (
    <Container style={styles.removeButton} onPress={handleDeleteAddress}>
      <Icon name="trash" size={28} type="evil" color={theme.lighterBlack} />
    </Container>
  )
}

const AddressListActiveAddress = ({ address, hasSelection }) => (
  <Container style={styles.addressContainer}>
    {hasSelection && (
      <Container pr={1}>
        <AdoreSvgIcon color="green" name="check-item" width={18} height={18} />
      </Container>
    )}
    <Container style={styles.activeAddressLineContainer}>
      <AddressLine isActive address={address} />
    </Container>
  </Container>
)

const AddressListInactiveAddress = ({ onAddressPress, address, index, hasSelection, disabled, isAddressPressable }) => (
  <Container
    style={styles.addressContainer}
    pl={hasSelection ? 3.8 : 1}
    onPress={!disabled && isAddressPressable && (() => onAddressPress({ activeAddress: index }))}
  >
    <AddressLine color={hasSelection ? theme.darkGrayDark : theme.black} address={address} />
  </Container>
)

export const AddressListItemDefaultAddress = ({ onAddressPress = () => {}, isDefaultAddress }) => (
  <Container>
    {isDefaultAddress && (
      <Container style={styles.defaultAddressContainer} background={theme.lightGrey}>
        <AdoreSvgIcon name="Tick" width={12} height={10} color={theme.green} />
        <Type semiBold pl={0.5} style={styles.defaultAddressText}>
          default address
        </Type>
      </Container>
    )}
    {!isDefaultAddress && (
      <Container
        border={theme.darkGray}
        borderWidth={0.5}
        style={styles.defaultAddressContainer}
        onPress={onAddressPress}
      >
        <Type semiBold style={styles.defaultAddressText} color={theme.darkGray}>
          set as default address
        </Type>
      </Container>
    )}
  </Container>
)

const AddressListItem = props => {
  const defaultAddress = useActionState('customer.defaultAddress')

  const {
    activeAddressIndex,
    filteredAddresses,
    address,
    index,
    onPress,
    disabled,
    dispatch,
    isLastItem,
    isAddressPressable
  } = props

  const handleAddressPress = ({ activeAddress, shouldSaveAsDefaultAddress = false }) => {
    onPress({
      address: filteredAddresses[activeAddress],
      selectedAddressIndex: activeAddress,
      shouldSaveAsDefaultAddress
    })
  }

  return (
    <Container key={`address-${index}`} opacity={disabled ? 0.6 : 1}>
      {activeAddressIndex === index ? (
        <AddressListActiveAddress onAddressPress={handleAddressPress} {...props} />
      ) : (
        <AddressListInactiveAddress onAddressPress={handleAddressPress} {...props} />
      )}
      <AddressListItemDefaultAddress
        isDefaultAddress={defaultAddress ? address?.id === defaultAddress?.id : address?.is_default_shipping}
        onAddressPress={() =>
          handleAddressPress({
            activeAddress: index,
            shouldSaveAsDefaultAddress: true
          })
        }
        isAddressPressable={isAddressPressable}
      />
      <AddressListRemoveAddressButton disabled={disabled} dispatch={dispatch} address={address?.id} />
      {!isLastItem && <Hr style={styles.hr} full />}
    </Container>
  )
}

export default AddressListItem
