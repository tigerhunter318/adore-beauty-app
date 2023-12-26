import { getPromotionsData } from '../../promotions/utils/helpers'
import useHasuraQuery from '../../../gql/hasura/utils/useHasuraQuery'
import { removeArrayDuplicates } from '../../../utils/array'
import BrandPromotionsQuery from '../../../gql/hasura/promotions/BrandPromotionsQuery'
import { toDashCase } from '../../../utils/format'
import { useSafeInsets } from '../../../utils/dimensions'
import { promoQueryTimeStamp } from '../../../gql/hasura/utils/timestamp'

export const useSearchCurrentOffers = (hits: any) => {
  const { bottom: safeBottomInset } = useSafeInsets()
  const brandsIdentifiers = removeArrayDuplicates(
    hits
      ?.flatMap((hit: { manufacturer: any }) => hit.manufacturer)
      .map((brand: any) => toDashCase(brand))
      .filter((x: any) => x)
      .sort((a: number, b: number) => a - b)
  ).slice(0, 10)

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

  return { offers, headerHeight: safeBottomInset + 48 }
}
