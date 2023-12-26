import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { vw } from '../../utils/dimensions'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Loading from '../ui/Loading'
import ResponsiveImage from '../ui/ResponsiveImage'
import BrandFilterByLetter from '../shop/BrandFilterByLetter'
import theme from '../../constants/theme'
import groupBrandsByLetter from '../../utils/groupBrandsByLetter'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import PromoItem from './PromoItem'
import { getPromotionsData } from './utils/helpers'
import useScreenQuery from '../../gql/useScreenQuery'
import { promoQueryTimeStamp } from '../../gql/hasura/utils/timestamp'
import BrandsPromotionsQuery from '../../gql/hasura/promotions/BrandsPromotionsQuery'

const brandWidth = (vw() - 50) / 3

const styles = StyleSheet.create({
  filter: {
    borderBottomWidth: 1,
    borderBottomColor: theme.black,
    alignItems: 'center'
  },
  resultsText: {
    paddingVertical: 30,
    fontSize: 13,
    lineHeight: 21,
    color: theme.black
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  brandContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 25
  },
  brand: {
    borderStyle: 'dashed',
    borderColor: theme.darkGrayWithOpacity,
    borderWidth: 0.5,
    width: brandWidth,
    height: brandWidth,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    borderStyle: 'solid',
    borderColor: theme.black
  },
  promoContainer: {
    paddingHorizontal: 20,
    marginTop: 45
  }
})

type BrandsContainerProps = {
  brands: [] | any
  selectBrand: (brand: { comestri_brand_id: number }) => void
  selectedBrands: number[] | null
}

const BrandsContainer = ({ brands = [], selectBrand, selectedBrands }: BrandsContainerProps) => (
  <Container align>
    <Type style={styles.resultsText}>
      Found <Type bold> {brands?.length || 0} </Type>
      {brands?.length === 1 ? 'brand' : 'brands'}
    </Type>
    <Container style={styles.brandContainer}>
      {isValidArray(brands) &&
        brands.map((brand: { comestri_brand_id: any; image_link: any; name: any }, index: any) => (
          <Container
            key={`brand-${index}`}
            style={[styles.brand, selectedBrands?.includes(brand.comestri_brand_id) && styles.active]}
            onPress={() => selectBrand(brand)}
          >
            {brand.image_link ? (
              <ResponsiveImage
                width={240}
                height={200}
                src={brand.image_link}
                styles={{ image: { resizeMode: 'contain' } }}
                useAspectRatio
              />
            ) : (
              <Type bold numberOfLines={1} size={12}>
                {brand.name}
              </Type>
            )}
          </Container>
        ))}
    </Container>
  </Container>
)

const PromoBrands = ({ isScreenRefreshing }: { isScreenRefreshing: boolean }) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('')
  const [selectedBrands, setSelectedBrands] = useState<number[] | null>(null)
  const [filteredBrands, setFilteredBrands] = useState<number[] | null>(null)
  const { data, handleRefresh, initialComponent } = useScreenQuery(BrandsPromotionsQuery, {
    variables: { display_locations: { _contains: { promotion_page: true } }, queryDate: promoQueryTimeStamp() },
    LoaderComponent: <Loading lipstick style={{ height: 120 }} />,
    useQueryHook: useHasuraQuery,
    skip: isScreenRefreshing
  })

  useEffect(() => {
    if (isScreenRefreshing) {
      handleRefresh()
    }
  }, [isScreenRefreshing])

  if (initialComponent) {
    return initialComponent
  }

  if (!isValidArray(data?.brands)) return null

  const fetchedData = data && groupBrandsByLetter(data.brands)

  const selectBrand = (regex: RegExp) => {
    let mappedData = []

    if (isValidArray(fetchedData)) {
      mappedData = fetchedData
        .filter((brand: { letter: any }) => brand?.letter && regex.test(brand.letter))
        .map((brand: { data: any }) => brand?.data)
        .flat()
    }

    setFilteredBrands(mappedData)
  }

  const handleSelectBrand = (brand: { comestri_brand_id: number }) => {
    if (!Array.isArray(selectedBrands) || !brand.comestri_brand_id) return
    let newSelectedBrands = [...selectedBrands, brand.comestri_brand_id]

    if (isValidArray(selectedBrands) && selectedBrands.includes(brand.comestri_brand_id)) {
      newSelectedBrands = selectedBrands.filter(item => item !== brand.comestri_brand_id)
    }

    setSelectedBrands(newSelectedBrands)
  }

  const handleSelectLetter = (selected: React.SetStateAction<string>) => {
    setSelectedLetter(selected)
    setSelectedBrands([])

    switch (selected) {
      case 'show_all':
        setFilteredBrands(null)
        setSelectedLetter('')
        break
      case '#':
        selectBrand(/^[0-9]+$/)
        break
      default: {
        const regex = new RegExp(`[${selected}]`)
        selectBrand(regex)
      }
    }
  }

  const brands = filteredBrands || data?.brands

  const letters = fetchedData
    .reduce((acc: any, item: { letter: string }) => [...acc, item.letter], [])
    .sort((a: string, b: string) => a.localeCompare(b))
  const selectedBrandsData = brands.filter((brand: { comestri_brand_id: number }) =>
    selectedBrands?.includes(brand.comestri_brand_id)
  )
  const brandsData = isValidArray(selectedBrandsData) ? selectedBrandsData : brands
  const promoItems = getPromotionsData(brandsData)
  const isPromoVisible = !isValidArray(selectedLetter) || (isValidArray(selectedLetter) && isValidArray(filteredBrands))

  return (
    <Container mt={2}>
      {isValidArray(letters) && (
        <Container ml={2}>
          <BrandFilterByLetter
            brandLetters={letters}
            selectedLetter={selectedLetter}
            selectLetter={handleSelectLetter}
            justify="flex-start"
          />
        </Container>
      )}
      {brands && <BrandsContainer brands={brands} selectBrand={handleSelectBrand} selectedBrands={selectedBrands} />}
      {!!isPromoVisible && (
        <Container style={styles.promoContainer}>
          {isValidArray(promoItems) && promoItems.map((item: {}, key: number) => <PromoItem item={item} key={key} />)}
        </Container>
      )}
    </Container>
  )
}

export default PromoBrands
