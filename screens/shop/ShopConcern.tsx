import React from 'react'
import { FlatList } from 'react-native'
import { isValidArray } from '../../utils/validation'
import Container from '../../components/ui/Container'
import Loading from '../../components/ui/Loading'
import Type from '../../components/ui/Type'
import theme from '../../constants/theme'
import AdoreSvgIcon from '../../components/ui/AdoreSvgIcon'
import useHasuraQuery from '../../gql/hasura/utils/useHasuraQuery'
import useScreenQuery from '../../gql/useScreenQuery'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import CategoryConcernsQuery from '../../gql/hasura/categories/CategoryConcernsQuery'

const ConcernListItem = ({
  item: { name },
  image,
  onPress
}: {
  item: { name: string }
  image: string | any
  onPress: () => void
}) => (
  <Container
    onPress={onPress}
    rows
    align
    pv={1}
    pl={2}
    ph={1.5}
    justify="space-between"
    style={{ borderColor: theme.borderColor, borderBottomWidth: 1 }}
  >
    <Container rows center>
      <ResponsiveImage
        width={40}
        height={40}
        src={image}
        useAspectRatio
        styles={{ container: { width: 40, height: 40 } }}
      />
      <Type pl={1} size={12} heading letterSpacing={1}>
        {name}
      </Type>
    </Container>
    <AdoreSvgIcon name="ArrowRight" width={16} height={13} />
  </Container>
)

const ShopConcern = ({ navigation }: any) => {
  const { data } = useScreenQuery(CategoryConcernsQuery, {
    variables: {
      condition: { is_concern_category: { _eq: true }, children: { is_concern_category: { _eq: true } } },
      skipChildren: true
    },
    useQueryHook: useHasuraQuery
  })

  const handleItemPress = (item: { metadata: { url_path: string } }) => {
    navigation.push('ShopConcernCategory', { url_path: item.metadata.url_path })
  }

  if (!isValidArray(data?.concerns)) return <Loading lipstick screen />

  return (
    <FlatList
      testID="ShopConcern.List"
      numColumns={1}
      data={data.concerns}
      renderItem={({ item }) => (
        <ConcernListItem
          item={item}
          image={item.images?.[0]?.image?.url_relative}
          onPress={() => handleItemPress(item)}
        />
      )}
      keyExtractor={item => `concern-item-${item.name}`}
    />
  )
}

export default ShopConcern
