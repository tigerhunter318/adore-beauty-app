import React from 'react'
import { StyleSheet } from 'react-native'
import { vw } from '../../utils/dimensions'
import { AddressLine } from './AddressListItem'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import CustomButton from '../ui/CustomButton'
import Icon from '../ui/Icon'
import AccountAddressForm from './AccountAddressForm'
import Hr from '../ui/Hr'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10
  },
  address: {
    paddingLeft: 31,
    paddingTop: 10,
    letterSpacing: 1
  },
  addressLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 20
  },
  buttonsContainer: {
    paddingHorizontal: 30,
    paddingTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  addNewAddress: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 10
  },
  hr: {
    backgroundColor: theme.darkGray,
    height: 0.3,
    marginBottom: 0,
    marginTop: 20
  }
})

export const AddNewAddressButton = ({ onPress, containerStyle = {} }) => (
  <Container style={[styles.addNewAddress, containerStyle]} onPress={onPress} border={theme.black}>
    <Icon type="ion" name="ios-add" size={22} color={theme.black} />
    <Type semiBold style={styles.buttonText}>
      Add New Address
    </Type>
  </Container>
)

const NewAddress = ({ onModal, onSaveAddress, newAddress, form, onCancelNewAddress }) => (
  <Container>
    {newAddress ? (
      <Container style={styles.container}>
        <AccountAddressForm form={form} />
        <Type style={styles.address}>Address</Type>
        <Container style={styles.addressLine}>
          <AddressLine address={newAddress} />
        </Container>
        <Container style={styles.buttonsContainer}>
          <CustomButton
            style={{ width: vw(41) }}
            semiBold
            background={theme.white}
            borderColor={theme.black}
            borderWidth={1}
            pv={1.4}
            onPress={onCancelNewAddress}
          >
            cancel
          </CustomButton>
          <CustomButton
            style={{ width: vw(41) }}
            pv={1.5}
            semiBold
            background={theme.black}
            color={theme.white}
            borderColor={theme.black}
            borderWidth={0}
            onPress={onSaveAddress}
          >
            save
          </CustomButton>
        </Container>
      </Container>
    ) : (
      <AddNewAddressButton onPress={onModal} />
    )}
    <Hr style={styles.hr} full />
  </Container>
)

export default NewAddress
