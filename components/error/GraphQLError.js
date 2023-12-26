import React from 'react'
import Container from '../ui/Container'
import CustomButton from '../ui/CustomButton'
import Type from '../ui/Type'
import { vw } from '../../utils/dimensions'

const GraphQLError = ({
  title = 'Sorry, an internal error has occurred',
  description = 'Please wait a few moments before tapping OK and we’ll try loading it again for you.',
  onConfirmPress,
  loading
}) => (
  <Container pt={4} ph={1}>
    <Type bold size={18} center mb={1}>
      {title}
    </Type>
    <Type center>{description}</Type>
    <Container mt={2} align="center">
      <CustomButton width={vw(60)} semiBold onPress={onConfirmPress} loading={loading}>
        OK
      </CustomButton>
    </Container>
  </Container>
)

export default GraphQLError
