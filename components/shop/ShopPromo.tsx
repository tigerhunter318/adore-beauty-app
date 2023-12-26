import React, { useEffect } from 'react'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import ShopPromoItems, { ShopPromoItemsProps } from './ShopPromoItems'
import { promoQueryTimeStamp } from '../../gql/hasura/utils/timestamp'
import getPromotionsQuery from '../../gql/hasura/promotions/getPromotionsQuery'
import ContentLoading from '../ui/ContentLoading'

type ShopPromoProps = ShopPromoItemsProps & {
  skip?: boolean
  isScreenRefreshing: boolean
}

const ShopPromo = ({ skip = true, isScreenRefreshing = false, ...props }: ShopPromoProps) => {
  const { data, loading, refetch } = useHasuraQuery(getPromotionsQuery(), {
    variables: { queryDate: promoQueryTimeStamp(), skip }
  })

  const handleRefresh = () => {
    if (isScreenRefreshing) {
      refetch()
    }
  }

  useEffect(handleRefresh, [isScreenRefreshing])

  if (loading || isScreenRefreshing)
    return <ContentLoading type="ProductCarousel" height={370} styles={{ container: { marginBottom: 83 } }} />

  return <ShopPromoItems items={data?.promotions} loading={loading} {...props} />
}

export default ShopPromo
