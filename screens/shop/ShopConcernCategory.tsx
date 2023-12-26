import React from 'react'
import { ScrollView } from 'react-native'
import { isValidArray } from '../../utils/validation'
import { formatUrlPathQueryVariables } from '../../gql/hasura/utils/format'
import Container from '../../components/ui/Container'
import Loading from '../../components/ui/Loading'
import ConcernList from '../../components/concern/ConcernList'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import useScreenQuery from '../../gql/useScreenQuery'
import CategoryConcernsQuery from '../../gql/hasura/categories/CategoryConcernsQuery'

const ShopConcernCategory = ({ route, navigation }: any) => {
  const url = route.params.url_path
  const { data } = useScreenQuery(CategoryConcernsQuery, {
    variables: {
      condition: {
        is_concern_category: { _eq: true },
        children: { is_concern_category: { _eq: true } },
        ...formatUrlPathQueryVariables(url)
      },
      skipChildren: false
    },
    useQueryHook: useHasuraQuery,

    skip: !url
  })
  const concerns = data?.concerns?.[0]?.children

  const handleItemPress = (item: { metadata: { url_path: string } }) => {
    navigation.push('ShopCategoryProducts', { url_path: item.metadata.url_path })
  }

  if (!isValidArray(concerns)) return <Loading lipstick screen />

  return (
    <ScrollView testID="ShopConcernCategoryScreen.ScrollView">
      <Container pv={2}>
        <ConcernList data={concerns} onItemPress={handleItemPress} />
      </Container>
    </ScrollView>
  )
}

export default ShopConcernCategory
