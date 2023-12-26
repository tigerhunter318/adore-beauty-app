import React from 'react'
import { useRoute } from '@react-navigation/core'
import ProductDetailQuery, { formatProductDetailQueryConditions } from '../../../gql/hasura/products/ProductDetailQuery'
import useScreenQuery from '../../../gql/useScreenQuery'
import useHasuraQuery from '../../../gql/hasura/utils/useHasuraQuery'
import ContentLoading from '../../ui/ContentLoading'
import { vh } from '../../../utils/dimensions'
import { formatProductData } from '../../../gql/hasura/products/utils/formatProductData'
import { formatReviewsData } from '../../../gql/hasura/reviews/utils/formatReviewsData'
import { useActionState } from '../../../store/utils/stateHook'
import { isLuxuryBrandProduct, isValidObject } from '../../../utils/validation'
import { gaEvents } from '../../../services/ga'
import { tealiumEvents } from '../../../services/tealium'
import branchEvents from '../../../services/branch/branchEvents'
import { smartlook } from '../../../services/smartlook'
import { emarsysEvents } from '../../../services/emarsys/emarsysEvents'
import { useScreenFocusEffect } from '../../../hooks/useScreen'
import { removeArrayDuplicates } from '../../../utils/array'
import ConsentForm from '../../consent/ConsentForm'
import ProductNotFound from '../../error/ProductNotFound'
import { getInitialVariantOption } from '../utils/getInitialVariantOption'
import { useRecentProducts } from '../../shop/hooks/useRecentProducts'

const useProductDetailScreenEffect = (screenType: string = 'Product') => {
  const route: any = useRoute()
  const params = route?.params?.data || route?.params || ({} as any)
  const { name: nameParam, queryId, child_product_id: childProductId } = params
  const isConsentGiven = useActionState('customer.isConsentGiven')
  const conditions = formatProductDetailQueryConditions(params)
  const { addRecentProduct } = useRecentProducts({ skip: true })

  const {
    complete: isQueryCompleted,
    data: productData,
    loading,
    initialComponent,
    refreshing,
    handleRefresh
  } = useScreenQuery(ProductDetailQuery, {
    variables: { conditions },
    useQueryHook: useHasuraQuery,
    notifyOnNetworkStatusChange: true,
    LoaderComponent: <ContentLoading type="ProductMain" height={vh(100)} />,
    skip: !conditions,
    formatResponse: response => {
      const data = response?.products?.[0]
      if (data) {
        return {
          ...formatProductData({ product: data, shouldFormatVariations: true }),
          ...formatReviewsData(data)
        }
      }
    }
  })
  const selectedOption: any = getInitialVariantOption({ routeParams: route.params, productData })

  const brandIdentifier = productData?.brand_identifier_s || ''
  const isLuxuryProduct = isLuxuryBrandProduct(productData)
  const isTGARestricted = productData?.is_tga_restricted
  const isConsentNeeded = productData?.is_consent_needed

  const logViewItem = () => {
    if (isQueryCompleted && isValidObject(productData)) {
      gaEvents.viewItem(productData)
      gaEvents.screenView(screenType, productData.name)
      tealiumEvents.addProductView(productData)
      branchEvents.trackViewProduct(productData)
      smartlook.trackNavigationEvent(screenType)
      emarsysEvents.trackItemView(Number(productData.product_id))
      addRecentProduct(productData.sku)
    }
  }

  const handleScreenFocus = () => {
    logViewItem()
  }

  useScreenFocusEffect(handleScreenFocus, [isQueryCompleted])

  let productImages
  if (productData) {
    productImages = productData.productImages

    if (selectedOption) {
      productImages = removeArrayDuplicates([selectedOption.main_image_url, ...productImages])
      productData.price = selectedOption.price
      productData.oldPrice = selectedOption.oldPrice
      productData.specialPrice = ''
    }

    if (queryId) {
      productData.queryId = queryId
    }

    if (childProductId) {
      productData.childProductId = childProductId
    }
  }

  let ViewComponent

  if (isConsentNeeded && !isConsentGiven) {
    ViewComponent = <ConsentForm />
  }
  if (initialComponent) ViewComponent = initialComponent

  if (isQueryCompleted && !isValidObject(productData))
    ViewComponent = <ProductNotFound data={route.params} onRetry={handleRefresh} loading={loading} />

  if (!isQueryCompleted && !loading) ViewComponent = null

  return {
    nameParam,
    loading,
    refreshing,
    handleRefresh,
    productImages,
    productData,
    brandIdentifier,
    isLuxuryProduct,
    isTGARestricted,
    selectedOption,
    ViewComponent
  }
}

export default useProductDetailScreenEffect
