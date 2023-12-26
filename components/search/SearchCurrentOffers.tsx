import React from 'react'
import { isValidArray } from '../../utils/validation'
import { getPromotionsData } from '../promotions/utils/helpers'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import CurrentOffers from '../promotions/CurrentOffers'
import { removeArrayDuplicates } from '../../utils/array'
import BrandPromotionsQuery from '../../gql/hasura/promotions/BrandPromotionsQuery'
import { toDashCase } from '../../utils/format'
import { useSafeInsets } from '../../utils/dimensions'
import { promoQueryTimeStamp } from '../../gql/hasura/utils/timestamp'

type SearchCurrentOffersProps = { hits: any; hidden: boolean }

const SearchCurrentOffers = ({ hits, hidden }: SearchCurrentOffersProps) => {
  const { bottom: safeBottomInset } = useSafeInsets()
  const brandsIdentifiers = removeArrayDuplicates(
    hits
      ?.flatMap((hit: { manufacturer: any }) => hit.manufacturer)
      .map((brand: any) => toDashCase(brand))
      .filter((x: any) => x)
      .sort((a: number, b: number) => a - b)
  ).slice(0, 10)

  // @ts-ignore
  const { data } = useHasuraQuery(BrandPromotionsQuery, {
    variables: {
      where: {
        identifier: { _in: brandsIdentifiers }
      },
      display_locations: { _contains: { search: true } },
      queryDate: promoQueryTimeStamp()
    },
    skip: !brandsIdentifiers
  })

  const offers = getPromotionsData(data?.brands)

  if (!isValidArray(offers)) return null

  return <CurrentOffers offers={offers} headerHeight={safeBottomInset + 48} isHeaderHidden={hidden} />
}

export default SearchCurrentOffers
