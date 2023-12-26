import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { sanitizeContent } from '../../utils/format'
import { px, vw } from '../../utils/dimensions'
import Container from '../ui/Container'
import Type from '../ui/Type'
import ResponsiveImage from '../ui/ResponsiveImage'
import CustomCarousel from '../ui/CustomCarousel'
import RichTextContentDescription from '../RichText/RichTextContentDescription'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import theme from '../../constants/theme'
import Clipboard from '../../services/clipboard'
import Toast from '../../services/toast'
import { isValidObject } from '../../utils/validation'
import { getIn } from '../../utils/getIn'
import { formatPromotionData, formatPromotionDescription } from './utils/helpers'
import ImageSize from '../../constants/ImageSize'

const { width: productImageWidth, height: productImageHeight } = ImageSize.product.medium

const styles = StyleSheet.create({
  promoContainer: {
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderRadius: 1
  },
  image: {
    resizeMode: 'contain',
    width: 160,
    height: 65
  },
  productImage: {
    resizeMode: 'contain',
    width: 250,
    height: 250
  },
  imageContainer: {
    alignItems: 'center'
  },
  shopButtonContainer: {
    backgroundColor: theme.black,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  shopButtonText: {
    fontSize: 16,
    color: theme.white,
    textTransform: 'uppercase'
  },
  code: {
    paddingHorizontal: 10,
    backgroundColor: theme.codeOrange,
    lineHeight: 28,
    letterSpacing: 3,
    fontSize: 15,
    textAlign: 'center'
  },
  title: {
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 20
  }
})

const getBtnLabel = (redeemUrl: string, hasCouponCode: any) => {
  if (redeemUrl && redeemUrl !== '/') {
    if (hasCouponCode) {
      return 'COPY CODE & SHOP NOW'
    }
    return 'SHOP NOW'
  }

  if (hasCouponCode) {
    return 'COPY CODE'
  }

  return ''
}

const logoStyles = {
  image: { ...styles.image },
  container: { ...styles.imageContainer }
}

const imageStyles = {
  image: { ...styles.productImage },
  container: { ...styles.imageContainer }
}

const PromoCopyButton = ({ onPress, isLoading, label }: { onPress: () => void; isLoading: boolean; label: string }) => (
  <Container center mt={2}>
    <Container style={styles.shopButtonContainer} onPress={onPress} disabled={isLoading} loading={isLoading}>
      <Type semiBold style={styles.shopButtonText}>
        {label}
      </Type>
    </Container>
  </Container>
)

type SimplePromoProps = {
  data: {} | any
  hasCouponCode: boolean
  onPressPromoItem: () => void
  isLoading: boolean
}

const SimplePromo = ({ data, hasCouponCode, onPressPromoItem, isLoading }: SimplePromoProps) => {
  const { code, brandLogo, message, siteMessage, image, redeemUrl, amount, title } = data
  const btnLabel = getBtnLabel(redeemUrl, hasCouponCode)
  const text = siteMessage || message

  return (
    <Container pv={3.35} ph={2}>
      {!!brandLogo && <ResponsiveImage src={brandLogo} styles={logoStyles} width={230} height={65} useAspectRatio />}
      {!!title && (
        <Type bold style={styles.title} mt={3}>
          {title}
        </Type>
      )}
      {!!text && (
        <Container mt={1} center>
          <RichTextContentDescription content={sanitizeContent(text)} align="left" />
        </Container>
      )}
      {!!image && (
        <Container mt={2}>
          <ResponsiveImage
            src={image}
            styles={imageStyles}
            width={productImageWidth}
            height={productImageHeight}
            useAspectRatio
          />
        </Container>
      )}
      {hasCouponCode && (
        <Type heading center letterSpacing={1} mt={1}>
          USE CODE: <Type color={theme.orange}>{code}</Type>
        </Type>
      )}
      {!!btnLabel && (
        <PromoCopyButton label={amount ? btnLabel : 'Sold out'} isLoading={isLoading} onPress={onPressPromoItem} />
      )}
    </Container>
  )
}

type ComplexPromoCarouselItemProps = {
  item: {}
  btnLabel: string
  amount: number | string
  isLoading: boolean
  onPressPromoItem: () => void
  style?: any
}

const ComplexPromoCarouselItem = ({
  item,
  btnLabel,
  amount,
  isLoading,
  onPressPromoItem,
  style = {}
}: ComplexPromoCarouselItemProps) => {
  const title = getIn(item, 'name')
  const description = formatPromotionDescription(getIn(item, 'description'))
  const brandLogo = getIn(item, 'brands.0.brand.image_link')
  const image = getIn(item, 'images.0.image.url_relative')

  return (
    <Container mt={2} style={style}>
      {!!image && (
        <ResponsiveImage
          src={image}
          styles={imageStyles}
          width={productImageWidth}
          height={productImageHeight}
          useAspectRatio
        />
      )}
      {!!brandLogo && <ResponsiveImage src={brandLogo} styles={logoStyles} width={230} height={65} useAspectRatio />}
      {!!title && (
        <Type bold style={styles.title} mt={3}>
          {title}
        </Type>
      )}
      {!!description && (
        <Container mt={2} center>
          <RichTextContentDescription content={sanitizeContent(description)} align="left" />
        </Container>
      )}
      {!!btnLabel && (
        <PromoCopyButton label={amount ? btnLabel : 'Sold out'} isLoading={isLoading} onPress={onPressPromoItem} />
      )}
    </Container>
  )
}

type ComplexPromoProps = {
  data: {} | any
  hasCouponCode: any
  onPressPromoItem: any
  isLoading: any
}

const ComplexPromo = ({ data, hasCouponCode, onPressPromoItem, isLoading }: ComplexPromoProps) => {
  const { code, message, siteMessage, title, products, redeemUrl, amount } = data
  const btnLabel = getBtnLabel(redeemUrl, hasCouponCode)
  const text = siteMessage || message

  const renderItem = useCallback(
    ({ item }) => (
      <ComplexPromoCarouselItem
        item={item}
        btnLabel={btnLabel}
        amount={amount}
        onPressPromoItem={onPressPromoItem}
        isLoading={isLoading}
        style={{ paddingHorizontal: 10 }}
      />
    ),
    []
  )

  return (
    <Container pv={3.35}>
      <Container ph={2}>
        {!!title && (
          <Type heading bold center size={24} letterSpacing={8} lineHeight={26}>
            {title}
          </Type>
        )}
        {!!text && (
          <Container mt={1.5} center>
            <RichTextContentDescription content={sanitizeContent(text)} align="left" />
          </Container>
        )}
        {hasCouponCode && (
          <Container mt={1.1} center>
            <Type bold style={styles.code}>
              use code{' '}
              <Type size={15} bold color={theme.orange}>
                {code}
              </Type>
            </Type>
          </Container>
        )}
      </Container>
      <Container ph={1}>
        <CustomCarousel items={products} containerHeight={px(600)} renderItem={renderItem} sliderWidth={vw(100) - 52} />
      </Container>
    </Container>
  )
}

const PromoItem = ({ item }: any) => {
  const urlNavigation = useUrlNavigation()
  const [loadingLinkUrl, setLoadingLinkUrl] = useState(null)
  const data = formatPromotionData(item)
  const { code, isAddFreeItem, products, redeemUrl } = data
  const hasCouponCode = !isAddFreeItem && code
  const promoType = products?.length > 2 ? 2 : 1

  const handlePressPromoItem = async () => {
    if (hasCouponCode) {
      Toast.show('Code copied', {
        duration: 1500,
        onShow: () => {
          Clipboard.copyToClipboard(code)
        }
      })
    }

    if (redeemUrl && redeemUrl !== '/' && redeemUrl !== loadingLinkUrl) {
      setLoadingLinkUrl(redeemUrl)
      await urlNavigation.push(redeemUrl)
      setLoadingLinkUrl(null)
    }
  }

  if (!isValidObject(data)) return null

  return (
    <Container style={styles.promoContainer}>
      {promoType === 1 ? (
        <SimplePromo
          data={data}
          hasCouponCode={hasCouponCode}
          onPressPromoItem={handlePressPromoItem}
          isLoading={redeemUrl && redeemUrl === loadingLinkUrl}
        />
      ) : (
        <ComplexPromo
          data={data}
          hasCouponCode={hasCouponCode}
          onPressPromoItem={handlePressPromoItem}
          isLoading={redeemUrl && redeemUrl === loadingLinkUrl}
        />
      )}
    </Container>
  )
}

export default PromoItem
