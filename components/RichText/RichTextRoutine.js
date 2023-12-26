import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import RichTextShoppableGroup from './RichTextShoppableGroup'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import { useActionState } from '../../store/utils/stateHook'
import cart from '../../store/modules/cart'
import theme from '../../constants/theme'
import CustomButton from '../ui/CustomButton'
import { vw } from '../../utils/dimensions'
import ViewportAware from '../viewport/ViewportAware'
import { fontStyles } from '../../constants/fontStyles'

const RichTextRoutine = ({ content, products, onProductPress }) => {
  const [selectedProducts, setProducts] = useState([])
  const isPending = useActionState('cart.request.pending')
  const dispatch = useDispatch()

  const handleAddRoutineToCart = async () => {
    const productData = selectedProducts.map(product => {
      const productInfo = products?.find(item => item.product_id === product.content.id)
      const sku = productInfo?.productSku[0]
      return { sku }
    })

    await dispatch(cart.actions.addProductsBySku(productData))
  }

  const toggleProductSelection = product => {
    if (selectedProducts.findIndex(item => item.content.id === product.content.id) === -1) {
      const newSelectedProducts = selectedProducts.slice(0)
      setProducts([...newSelectedProducts, product])
    } else {
      const newSelectedProducts = selectedProducts.filter(item => item.content.id !== product.content.id)
      setProducts(newSelectedProducts)
    }
  }
  let label = 'Add Routine To Bag'

  if (isPending) {
    label = 'Adding...'
  }

  if (!content) return null

  const { description, routineImage, productsAndGroup, title } = content
  const hasMultipleItems = productsAndGroup?.[0]?.content?.product?.length > 1

  return (
    <Container>
      {!!title?.trim() && (
        <Container pb={1} mt={1.5}>
          <Type style={fontStyles.h4} semiBold color={theme.lightBlack}>
            {title}
          </Type>
        </Container>
      )}
      {!!description && (
        <Container mt={1}>
          <Type color={theme.lightBlack}>{description}</Type>
        </Container>
      )}
      {!!routineImage && (
        <Container mt={1.5}>
          <ResponsiveImage src={routineImage} width={236} height={236} useAspectRatio />
        </Container>
      )}
      <Container pb={2} mt={2}>
        {productsAndGroup?.map((item, key) => (
          <Container rows mb={2} key={`keyIndex-${key}`}>
            {item.type === 'shoppableGroup' && (
              <>
                {!hasMultipleItems && (
                  <Type pt={0.7} bold style={{ marginRight: 12, textAlign: 'right', width: 20 }}>
                    {key + 1}.
                  </Type>
                )}
                <ViewportAware>
                  {({ hasEnteredViewport }) => (
                    <RichTextShoppableGroup
                      selectedProducts={selectedProducts}
                      content={item.content}
                      toggleProductSelection={toggleProductSelection}
                      products={products}
                      hasEnteredViewport={hasEnteredViewport}
                      hasMultipleItems={hasMultipleItems}
                      onProductPress={onProductPress}
                    />
                  )}
                </ViewportAware>
              </>
            )}
          </Container>
        ))}
        <Container align="center">
          <CustomButton
            pt={1.5}
            pb={1.5}
            width={vw(90)}
            background={theme.white}
            color={theme.black}
            onPress={handleAddRoutineToCart}
            disabled={selectedProducts.length === 0 || isPending}
          >
            {label}
          </CustomButton>
        </Container>
      </Container>
    </Container>
  )
}

export default RichTextRoutine
