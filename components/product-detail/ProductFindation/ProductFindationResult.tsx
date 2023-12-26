import React from 'react'
import Container from '../../ui/Container'
import CustomButton from '../../ui/CustomButton'
import Type from '../../ui/Type'
import { useActionState } from '../../../store/utils/stateHook'
import theme from '../../../constants/theme'
import { pluraliseString } from '../../../utils/format'
import ProductFindationFooter from './ProductFindationFooter'

type ProductFindationResultProps = {
  data: any
  productName: string
  onAddMoreShades: () => void
  onClose: () => void
}

const ProductFindationResult = ({ data, productName, onAddMoreShades, onClose }: ProductFindationResultProps) => {
  const shadeIds = useActionState('findation.shadeIds')
  const recommendedShade = data?.recommended_shade
  const message = data?.message

  return (
    <Container p={2}>
      {recommendedShade && (
        <Container mt={4} mb={1.4}>
          <Type size={16} center lineHeight={26.4}>
            Based on {pluraliseString(shadeIds?.length, 'shade')} you entered, your best match in
          </Type>
          <Type size={16} center lineHeight={26.4}>
            {data?.product_name}
          </Type>
          <Type size={16} center lineHeight={26.4}>
            is
          </Type>
          <Container pv={1}>
            <Type size={26} center bold italic lineHeight={26.4}>
              {recommendedShade}
            </Type>
          </Container>
          <Type size={14} center>
            Improve your match by adding more shades
          </Type>
          <CustomButton
            style={{
              backgroundColor: theme.black,
              alignItems: 'center'
            }}
            pv={1.25}
            mt={2.5}
            onPress={onAddMoreShades}
          >
            <Type bold size={15} heading color="white">
              Add more shades
            </Type>
          </CustomButton>
          <CustomButton
            style={{
              backgroundColor: theme.black,
              alignItems: 'center'
            }}
            pv={1.25}
            mt={1}
            onPress={onClose}
          >
            <Type bold size={15} heading color="white">
              Ok, got it
            </Type>
          </CustomButton>
        </Container>
      )}
      {message && (
        <Container mt={4} mb={1.4}>
          <Type size={16} lineHeight={26.4}>
            We couldn’t find a match with {productName} and the shade you entered. You&nbsp;can try adding more shades
          </Type>
          <CustomButton
            style={{
              backgroundColor: theme.black,
              alignItems: 'center'
            }}
            pv={1.25}
            mt={2.5}
            onPress={onAddMoreShades}
          >
            <Type bold size={15} heading color="white">
              Add more shades
            </Type>
          </CustomButton>
          <CustomButton
            style={{
              backgroundColor: theme.black,
              alignItems: 'center'
            }}
            pv={1.25}
            mt={1}
            onPress={onClose}
          >
            <Type bold size={15} heading color="white">
              Ok, got it
            </Type>
          </CustomButton>
        </Container>
      )}
      <ProductFindationFooter />
    </Container>
  )
}

export default ProductFindationResult
