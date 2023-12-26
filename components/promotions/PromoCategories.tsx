import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { isValidArray } from '../../utils/validation'
import Container from '../ui/Container'
import Type from '../ui/Type'
import Loading from '../ui/Loading'
import theme from '../../constants/theme'
import PromoItem from './PromoItem'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import { getPromotionsData } from './utils/helpers'
import useScreenQuery from '../../gql/useScreenQuery'
import { promoQueryTimeStamp } from '../../gql/hasura/utils/timestamp'
import CategoriesPromotionsQuery from '../../gql/hasura/promotions/CategoriesPromotionsQuery'

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
    marginTop: 20
  },
  catContainer: {
    paddingHorizontal: 23,
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.borderColor,
    marginHorizontal: 1,
    marginVertical: 1
  },
  activeCatContainer: {
    backgroundColor: theme.black,
    borderColor: theme.black
  }
})

type PromoCategoryProps = {
  onPress: () => void
  isActive?: boolean
  name: string
}

const PromoCategory = ({ onPress, isActive, name }: PromoCategoryProps) => (
  <Container style={[styles.catContainer, isActive && styles.activeCatContainer]} onPress={onPress}>
    <Type
      center
      letterSpacing={0.5}
      color={isActive ? 'white' : theme.lighterBlack}
      heading
      size={13}
      semiBold
      bold={isActive}
    >
      {name}
    </Type>
  </Container>
)

const PromoCategories = ({ isScreenRefreshing }: { isScreenRefreshing: boolean }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)
  const { data, handleRefresh, initialComponent } = useScreenQuery(CategoriesPromotionsQuery, {
    variables: { display_locations: { _contains: { promotion_page: true } }, queryDate: promoQueryTimeStamp() },
    LoaderComponent: <Loading lipstick style={{ height: 120 }} />,
    useQueryHook: useHasuraQuery
  })

  useEffect(() => {
    if (isScreenRefreshing) {
      handleRefresh()
    }
  }, [isScreenRefreshing])

  if (initialComponent) {
    return initialComponent
  }

  const categories = data?.categories

  if (!isValidArray(categories)) return null

  const selectedCategory = categories.filter(
    ({ comestri_category_id }: { comestri_category_id: any }) => comestri_category_id === activeCategoryId
  )
  const categoriesData = isValidArray(selectedCategory) ? selectedCategory : categories
  const promotions = getPromotionsData(categoriesData)

  const isActive = (category: null) => activeCategoryId === category

  const handlePress = (category: React.SetStateAction<number | null>) => setActiveCategoryId(category)

  return (
    <Container>
      {isValidArray(categories) && (
        <Container style={styles.container}>
          {categories.map(({ name, comestri_category_id: id }: any) => (
            <PromoCategory onPress={() => handlePress(id)} name={name} key={id} isActive={isActive(id)} />
          ))}
          <Container
            style={[styles.catContainer, !activeCategoryId && styles.activeCatContainer]}
            onPress={() => handlePress(null)}
          >
            <Type
              size={11}
              letterSpacing={0.5}
              center
              color={!activeCategoryId ? 'white' : theme.lighterBlack}
              semiBold
              bold={!activeCategoryId}
            >
              SHOW{'\n'}ALL
            </Type>
          </Container>
        </Container>
      )}
      {isValidArray(promotions) && (
        <Container ph={2} mt={2}>
          {promotions.map((item: {}, key: number) => (
            <PromoItem item={item} key={key} />
          ))}
        </Container>
      )}
    </Container>
  )
}

export default PromoCategories
