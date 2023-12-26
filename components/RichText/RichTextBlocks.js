import React, { memo } from 'react'
import { useNavigation } from '@react-navigation/core'
import RichTextContent from './RichTextContent'
import RichTextButton from './RichTextButton'
import RichTextEmbed from './RichTextEmbed'
import RichTextProductManagedCopy from './RichTextProductManagedCopy'
import RichTextReview from './RichTextReview'
import RichTextCategory from './RichTextCategory'
import RichTextMultipleCategoriesBrands from './RichTextMultipleCategoriesBrands'
import RichTextShoppableImage from './RichTextShoppableImage'
import RichTextMultipleShoppableImage from './RichTextMultipleShoppableImage'
import RichTextRoutine from './RichTextRoutine'
import RichTextEmailSignup from './RichTextEmailSignup'
import RichTextCardsMultiple from './RichTextCardsMultiple'
import RichTextImageManagedCopyCard from './RichTextImageManagedCopyCard'
import Container from '../ui/Container'
import { formatFromJson } from '../../utils/format'
import RichTextMultiTabs from './RichTextMultiTabs'

const RichTextBlocks = ({ items, products, imageProps, isConsentNeeded, styles = {} }) => {
  const navigation = useNavigation()
  const handleProductPress = item => {
    const routeParams = {
      product_id: item?.id,
      productSku: item?.sku,
      is_consent_needed: isConsentNeeded
    }
    navigation.push('ProductQuickView', routeParams)
  }
  const renderBlock = (item, index) => {
    const parsedContent = formatFromJson(item?.content)

    if (parsedContent) {
      switch (item?.type) {
        case 'content':
          return <RichTextContent imageProps={imageProps} key={`content-${index}`} content={parsedContent.html} />
        case 'externalContent':
          return <RichTextEmbed key={`content-${index}`} content={parsedContent} />
        case 'button':
          return <RichTextButton key={`content-${index}`} content={parsedContent} />
        case 'productManagedCopy':
          return <RichTextProductManagedCopy key={`content-${index}`} content={parsedContent} />
        case 'review':
          return <RichTextReview key={`content-${index}`} content={parsedContent} />
        case 'brand':
        case 'category':
          return <RichTextCategory key={`content-${index}`} content={parsedContent} />
        case 'multipleCategoriesBrands':
          return <RichTextMultipleCategoriesBrands key={`content-${index}`} content={parsedContent} />
        case 'shoppableImage':
          return <RichTextShoppableImage key={`content-${index}`} content={parsedContent} />
        case 'multipleShoppableImage':
          return <RichTextMultipleShoppableImage key={`content-${index}`} content={parsedContent} />
        case 'routine':
          return (
            <RichTextRoutine
              key={`content-${index}`}
              content={parsedContent}
              products={products}
              onProductPress={handleProductPress}
            />
          )
        case 'cardsMultiple':
          return <RichTextCardsMultiple key={`content-${index}`} content={parsedContent} />
        case 'emailSignup':
          return <RichTextEmailSignup key={`content-${index}`} content={parsedContent} />
        case 'multiTabs':
          return <RichTextMultiTabs key={`content-${index}`} content={parsedContent} />
        case 'imageManagedCopy':
          return <RichTextImageManagedCopyCard key={`content-${index}`} content={parsedContent} />
        default:
          break
      }
    }
  }

  return <Container style={styles}>{items?.map((item, index) => renderBlock(item, index))}</Container>
}

export default memo(RichTextBlocks)
