import { QueryResult } from '@apollo/client'
import { toDashCase } from '../../../../utils/format'
import useHasuraQuery from '../../utils/useHasuraQuery'
import LuxuryBrandsQuery from '../LuxuryBrandsQuery'

export type LuxuryBrandsResult = QueryResult & {
  luxuryBrands: any[] | undefined
  findLuxuryBrandUrl: (name: string) => any
  findLuxuryBrand: (name: string) => any
}

const useLuxuryBrands = (): LuxuryBrandsResult => {
  const queryResults = useHasuraQuery(LuxuryBrandsQuery, {}) as QueryResult
  const luxuryBrands = queryResults?.data?.brands

  const findLuxuryBrand = name => luxuryBrands?.find(brand => toDashCase(brand.name) === toDashCase(name))

  const findLuxuryBrandUrl = name => {
    const luxuryBrand = findLuxuryBrand(name)
    if (luxuryBrand?.metadata?.url_path) {
      return luxuryBrand.metadata?.url_path
    }
  }

  return { luxuryBrands, findLuxuryBrand, findLuxuryBrandUrl, ...queryResults }
}

export default useLuxuryBrands
