import React, { useEffect } from 'react'
import Container from '../../ui/Container'
import CustomButton from '../../ui/CustomButton'
import Type from '../../ui/Type'
import LoadingOverlay from '../../ui/LoadingOverlay'
import FormDropdown from '../../form/FormDropdown'
import { useActionState } from '../../../store/utils/stateHook'
import theme from '../../../constants/theme'
import ProductFindationFooter from './ProductFindationFooter'

const style = {
  spinnerContainerStyle: {
    flex: 1,
    justifyContent: 'center'
  }
}

type ProductFindationOptionProps = {
  onBrandChange: (item: any) => void
  onProductChange: (item: any) => void
  onShadeChange: (item: any) => void
  onFindMyMatch: (item: any) => void
  onInitialLoading: () => void
  form: any
}

const ProductFindationOption = ({
  onBrandChange,
  onProductChange,
  onShadeChange,
  onFindMyMatch,
  onInitialLoading,
  form
}: ProductFindationOptionProps) => {
  const brands = useActionState('findation.brands')
  const products = useActionState('findation.products')
  const shades = useActionState('findation.shades')
  const isFormValid = form.isValid()
  const isPending = useActionState('findation.request.pending')

  const onMount = () => {
    onInitialLoading()
  }

  useEffect(onMount, [])

  return (
    <Container>
      <Container p={2}>
        <Container mt={2} mb={1.4}>
          <Type size={24} semiBold lineHeight={26.4}>
            What shade have you used before?
          </Type>
        </Container>
        <Container mb={2}>
          <Type size={16} lineHeight={24}>
            Select a foundation that you have previously used and found to be a good match to your skin tone.
          </Type>
        </Container>
        <Container mb={2}>
          <FormDropdown
            form={form}
            options={brands}
            optionChanged={onBrandChange}
            name="brand"
            placeholder="Select Brand"
            required
            disabled={!brands}
            hasSearch
            hasCloseFooter
          />
        </Container>
        <Container mb={2}>
          <FormDropdown
            form={form}
            options={products}
            optionChanged={onProductChange}
            name="product"
            placeholder="Select Product"
            required
            disabled={!products}
            hasCloseFooter
          />
        </Container>
        <Container mb={2}>
          <FormDropdown
            form={form}
            options={shades}
            optionChanged={onShadeChange}
            name="shade"
            placeholder="Select Shade"
            required
            disabled={!shades}
            hasCloseFooter
          />
        </Container>
        <CustomButton
          style={{
            backgroundColor: theme.black,
            alignItems: 'center',
            fontWeight: 'bold'
          }}
          pv={1.25}
          mt={1.5}
          mb={3}
          disabled={!isFormValid}
          onPress={onFindMyMatch}
        >
          <Type bold size={15} heading color="white">
            Find my match
          </Type>
        </CustomButton>
        <ProductFindationFooter />
      </Container>
      <LoadingOverlay active={isPending} containerStyle={style.spinnerContainerStyle} />
    </Container>
  )
}

export default ProductFindationOption
