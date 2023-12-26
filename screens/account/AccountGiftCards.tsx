import React from 'react'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { isValidArray } from '../../utils/validation'
import { vw } from '../../utils/dimensions'
import { useScreenHeaderTitle } from '../../navigation/utils'
import Container from '../../components/ui/Container'
import AccountGiftCard from '../../components/account/AccountGiftCard'
import Type from '../../components/ui/Type'
import Loading from '../../components/ui/Loading'
import CustomButton from '../../components/ui/CustomButton'
import useCustomerCredits from '../../components/account/hooks/useCustomerCredits'

const GiftCardNotFound = () => {
  const navigation = useNavigation()

  return (
    <Container justify ph={1} flex={1}>
      <Type bold size={18} center mb={1}>
        Error
      </Type>
      <Type center>No gift cards found.</Type>
      <Container mt={2} align="center">
        <CustomButton width={vw(60)} onPress={() => navigation.goBack()}>
          Back
        </CustomButton>
      </Container>
    </Container>
  )
}

const AccountGiftCards = () => {
  const { availableGiftCertificates, isFetchPending } = useCustomerCredits()

  useScreenHeaderTitle(
    availableGiftCertificates?.length > 1 ? `gift cards (${availableGiftCertificates.length})` : 'gift card'
  )

  if (isFetchPending) return <Loading lipstick />

  if (!isValidArray(availableGiftCertificates)) return <GiftCardNotFound />

  const renderItem = ({ item, index }) => (
    <Container mb={2.2}>
      <AccountGiftCard data={item} isBlackTheme={index % 2 === 0} />
    </Container>
  )

  const keyExtractor = item => item.id

  return (
    <FlatList
      contentContainerStyle={{
        paddingVertical: 25,
        paddingHorizontal: 25
      }}
      data={availableGiftCertificates}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}

export default AccountGiftCards
