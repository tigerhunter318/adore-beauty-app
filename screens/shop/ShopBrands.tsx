import React, { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { isValidObject } from '../../utils/validation'
import BrandFilterByLetter from '../../components/shop/BrandFilterByLetter'
import Container from '../../components/ui/Container'
import SectionTitle from '../../components/ui/SectionTitle'
import theme from '../../constants/theme'
import Type from '../../components/ui/Type'
import ResponsiveImage from '../../components/ui/ResponsiveImage'
import useBrandsQuery from '../../gql/hasura/brands/hooks/useBrandsQuery'
import ListFooterLoadingIndicator from '../../components/ui/ListFooterLoadingIndicator'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import ImageSize from '../../constants/ImageSize'
import { px } from '../../utils/dimensions'

const { width, height } = ImageSize.brand.listing

const styles = {
  filter: {
    borderBottomWidth: 1,
    borderBottomColor: theme.black,
    alignItems: 'center'
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
  brand: {
    borderStyle: 'dashed',
    borderColor: theme.darkGrayWithOpacity,
    borderWidth: 1,
    width: px(width),
    height: px(height),
    margin: 2,
    padding: 8
  }
}

const ShopBrand = ({ brand, onBrandPress }: any) => {
  const image = brand?.logo
  const logo = !/(Blank_logo)/.test(image) && image

  return (
    <Container style={styles.brand} justify center onPress={onBrandPress}>
      {!!logo && (
        <ResponsiveImage
          width={width}
          height={height}
          displayWidth={px(90)}
          src={logo}
          styles={{ image: { resizeMode: 'contain' } }}
          useAspectRatio
        />
      )}
      {!logo && (
        <Type semiBold size={12} color={theme.lightBlack}>
          {brand.name_raw}
        </Type>
      )}
    </Container>
  )
}

const ShopBrands = () => {
  const [selectedLetter, setSelectedLetter] = useState<any>('show_all')
  const urlNavigation = useUrlNavigation()
  const { data, hasNextPage, refreshControl, onEndReached } = useBrandsQuery({ selectedLetter })
  const { brands, brandsCount } = data || {}

  const handleBrandPress = (item: any) => {
    if (isValidObject(item)) {
      urlNavigation.navigate(item.url_path)
    }
  }

  const renderItem = useCallback(
    ({ item: brand }) => <ShopBrand brand={brand} onBrandPress={() => handleBrandPress(brand)} />,
    [selectedLetter]
  )

  const keyExtractor = useCallback((item: any, index) => `${item.name}-${selectedLetter}-${index}`, [])

  return (
    <FlatList
      testID="ShopBrand.FlatList"
      data={brands}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      refreshControl={refreshControl}
      onEndReached={() => onEndReached(brands)}
      ListHeaderComponent={
        <Container pv={2.5} ph={2.2}>
          <SectionTitle text="Brands " highlightedText="a-Z" />
          <BrandFilterByLetter
            selectedLetter={selectedLetter === 'show_all' ? null : selectedLetter}
            selectLetter={setSelectedLetter}
          />
          {brands !== undefined && (
            <Container mt={2.5} align>
              <Type pv={1} size={13} lineHeight={21} color={theme.black}>
                Found <Type bold> {brandsCount} </Type> {brandsCount === 1 ? 'brand' : 'brands'}
              </Type>
            </Container>
          )}
        </Container>
      }
      ListFooterComponent={<ListFooterLoadingIndicator active={hasNextPage && brandsCount !== brands?.length} />}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30
      }}
    />
  )
}

export default ShopBrands
