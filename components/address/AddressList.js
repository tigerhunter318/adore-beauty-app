import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, ScrollView } from 'react-native'
import Container from '../ui/Container'
import addressUtil from '../../utils/addressUtil'
import AddressListItem from './AddressListItem'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import Type from '../ui/Type'

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flex: 1
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
  }
})

const AddressList = ({
  onAddressItemPress = () => {},
  isAddressPressable = true,
  initialAddress = null,
  addresses = [],
  FooterComponent = () => null,
  ListFooterComponent = () => null,
  containerStyle = {},
  hasSelection = false,
  disabled = false
}) => {
  const dispatch = useDispatch()
  const [activeAddressIndex, setActiveAddressIndex] = useState(null)
  const filteredAddresses = addressUtil.filterInvalidAddresses(addresses)

  const onMount = () => setActiveAddressIndex(initialAddress)

  useEffect(onMount, [initialAddress])

  return (
    <ScrollView>
      <Container style={styles.container}>
        <Container>
          <Container style={styles.savedAddressesContainer}>
            <AdoreSvgIcon name="addressbook" height={22} width={29} />
            <Type semiBold style={styles.savedAddressesTitle}>
              Saved Addresses {`(${filteredAddresses?.length})`}
            </Type>
          </Container>
          {filteredAddresses?.map((address, index) => (
            <AddressListItem
              containerStyle={containerStyle}
              activeAddressIndex={activeAddressIndex}
              onPress={onAddressItemPress}
              address={address}
              index={index}
              disabled={disabled}
              dispatch={dispatch}
              hasSelection={hasSelection}
              key={address.id}
              filteredAddresses={filteredAddresses}
              isAddressPressable={isAddressPressable}
              isLastItem={index === filteredAddresses.length - 1}
            />
          ))}
          <FooterComponent />
        </Container>
        <ListFooterComponent />
      </Container>
    </ScrollView>
  )
}

export default AddressList
