import React from 'react'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../../constants/theme'
import Type from '../ui/Type'
import Container from '../ui/Container'
import FieldSet from '../ui/FieldSet'
import { errorInputStyle, errorTextStyle, Required } from '../form/FormField'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'

const styleSheet = {
  downArrow: {
    position: 'absolute',
    right: 17,
    top: 16
  }
}

const DeliveryAddress = ({
  hasAddressError,
  toggleSaveAddress,
  initialAddressIndex,
  onModalOpen,
  form,
  isUserLoggedIn
}) => (
  <Container pb={2}>
    <FieldSet ph={2} pv={2}>
      <Type heading bold size={13} letterSpacing={1}>
        Choose a Delivery Address
      </Type>
    </FieldSet>
    <Container rows pt={2} pl={1.4}>
      <AdoreSvgIcon name="DispatchLight" width={38} height={18} align />
      <Type heading semiBold size={13}>
        Saved Address
      </Type>
      <Required />
    </Container>
    <Container ph={2}>
      <Container>
        <Container
          rows
          border={theme.borderColor}
          borderWidth={0.5}
          ph={1.8}
          pv={1.4}
          pr={4}
          mt={1}
          onPress={onModalOpen}
          style={hasAddressError ? { ...errorInputStyle(false) } : {}}
        >
          <Type numberOfLines={1}>{form.getValue('address') ? form.getValue('address') : 'New address...'}</Type>
          <Container style={styleSheet.downArrow}>
            <AdoreSvgIcon name="AngleDown" width={14} height={14} align />
          </Container>
        </Container>
        {hasAddressError && (
          <Type style={errorTextStyle} ml={0.5}>
            Enter a valid address
          </Type>
        )}
      </Container>
      {!!(initialAddressIndex === null && form.getValue('address')) && isUserLoggedIn && (
        <Container rows align onPress={toggleSaveAddress} mt={1.5} mb={0.5}>
          <CheckBox
            onClick={toggleSaveAddress}
            isChecked={form.getValue('isSaveAddressChecked')}
            checkedImage={<Icon name="check-box" size={24} color={theme.black} />}
            unCheckedImage={<Icon name="check-box-outline-blank" size={24} color={theme.black} />}
          />
          <Type ml={0.5}>Save address</Type>
        </Container>
      )}
    </Container>
  </Container>
)

export default DeliveryAddress
