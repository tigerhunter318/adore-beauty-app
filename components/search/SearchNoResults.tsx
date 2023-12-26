import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { vh, vw } from '../../utils/dimensions'
import Type from '../ui/Type'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'

const SearchNoResults = () => {
  const navigation = useNavigation()

  return (
    <Container style={{ height: vh(65) }} align justify>
      <Type bold size={18} center mb={1}>
        No results
      </Type>
      <Type size={16} ph={2} center pv={1}>
        Sorry, we couldn't find any results.
      </Type>
      <Container mt={2} align="center">
        <CustomButton pv={1.2} ph={4} textStyle={{ letterSpacing: 1 }} height={44} onPress={navigation.goBack}>
          Back
        </CustomButton>
      </Container>
    </Container>
  )
}
export default SearchNoResults
