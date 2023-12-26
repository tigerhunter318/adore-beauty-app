import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import CheckBox from 'react-native-check-box'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Container from '../ui/Container'
import Type from '../ui/Type'
import theme from '../../constants/theme'
import useProductQuery from '../../gql/useProductQuery'

const styles = {
  heading: {
    lineHeight: 18.9
  },
  text: {
    lineHeight: 28,
    flex: 1
  }
}

const RichTextShoppableItem = ({
  toggleProductSelection,
  item,
  selectedProducts,
  index,
  onItemPress,
  hasMultipleItems,
  isOutOfStock
}) => {
  const { id, name, url, hideLink } = item?.content
  const hasLink = url && !hideLink

  return (
    <Container rows key={`keyIndex-${id}`}>
      {hasMultipleItems && (
        <Type pt={0.7} pb={4} size={14} bold style={{ marginRight: 12, textAlign: 'right', width: 20 }}>
          {index + 1}.
        </Type>
      )}
      <Container justify rows style={{ width: '90%' }} mb={0}>
        {toggleProductSelection && (
          <CheckBox
            disabled={isOutOfStock || !selectedProducts}
            style={{ padding: 5, paddingLeft: 0, paddingRight: 10 }}
            onClick={() => toggleProductSelection(item)}
            unCheckedImage={
              <Icon name="check-box-outline-blank" size={24} color={isOutOfStock ? theme.lightGrey : theme.black} />
            }
            isChecked={!!selectedProducts?.find(selectedProduct => id && selectedProduct?.content?.id === id)}
          />
        )}
        {hasLink ? (
          <TouchableOpacity onPress={() => onItemPress(id)} style={{ flex: 1 }}>
            <Type>
              <Type size={16} color={theme.lightBlack} style={styles.text} underline>
                {name}
              </Type>
              {isOutOfStock && <Type color={theme.orange}> (out of stock)</Type>}
            </Type>
          </TouchableOpacity>
        ) : (
          <Type size={14} color={theme.lightBlack} style={styles.text}>
            {name}
          </Type>
        )}
      </Container>
    </Container>
  )
}

const RichTextShoppableGroup = ({
  content,
  toggleProductSelection,
  selectedProducts,
  hasEnteredViewport,
  hasMultipleItems,
  onProductPress
}) => {
  const productIds = content?.product?.map(product => product?.content?.id)
  const [fetchData, { data }] = useProductQuery({
    productIds,
    lazyQuery: true
  })

  useEffect(() => {
    if (hasEnteredViewport && !!productIds?.length) {
      fetchData()
    }
  }, [hasEnteredViewport])

  const isProductOutStock = id => {
    const product = data?.products?.find(item => item.product_id === id)
    if (product) {
      return product.qty < 1 || !product.isSalable
    }
    return undefined
  }

  return (
    <Container mt={0} flex={1}>
      {content?.title && (
        <Container pt={0.7} mb={0.5}>
          <Type size={14} style={styles.heading} color={theme.lightBlack} bold>
            {content.title}
          </Type>
        </Container>
      )}
      {content?.product?.map((item, index) => (
        <RichTextShoppableItem
          toggleProductSelection={toggleProductSelection}
          item={item}
          selectedProducts={selectedProducts}
          hasMultipleItems={hasMultipleItems}
          index={index}
          isOutOfStock={isProductOutStock(item?.content?.id)}
          onItemPress={id => onProductPress(item?.content)}
          key={`RichTextShoppableItem-${index}-${item?.id}`}
        />
      ))}
    </Container>
  )
}

export default RichTextShoppableGroup
