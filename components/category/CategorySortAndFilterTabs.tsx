import React from 'react'
import { StyleSheet } from 'react-native'
import { pluraliseString } from '../../utils/format'
import { useCategoryContext } from './CategoryProvider'
import { vw } from '../../utils/dimensions'
import theme from '../../constants/theme'
import Container from '../ui/Container'
import Type from '../ui/Type'
import useCategoryProductsSidebar from '../search/hooks/useCategoryProductsSidebar'
import CategoryProductsSidebar from './CategoryProductsSideBar'
import useCategoryFilters from './hooks/useCategoryFilters'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor
  },
  separator: {
    backgroundColor: theme.borderColor,
    height: '100%',
    width: 1.5,
    position: 'absolute',
    left: vw(50)
  },
  tab: {
    width: vw(50),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    fontSize: 12
  },
  tabText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    fontSize: 11,
    paddingTop: 5
  }
})

const CategorySortAndFilterTab = ({
  onPress,
  title,
  text,
  disabled = false
}: {
  onPress: (option: any) => void
  title: string
  text: string
  disabled: boolean
}) => (
  <Container onPress={onPress} disabled={disabled}>
    <Container style={styles.tab}>
      <Type bold style={styles.tabTitle} color={disabled ? theme.black50 : theme.black}>
        {title}
      </Type>
      <Type style={styles.tabText} color={disabled ? theme.black50 : theme.lighterBlack} numberOfLines={1}>
        {text}
      </Type>
    </Container>
  </Container>
)

const CategorySortAndFilterTabs = ({
  disabled = false,
  url,
  parentCategoryUrl
}: {
  disabled: boolean
  url: string
  parentCategoryUrl: string
}) => {
  const { appliedSortOption } = useCategoryContext()
  const { numOfActiveGroups: appliedFiltersCount } = useCategoryFilters()

  const { openSidebar } = useCategoryProductsSidebar(
    <CategoryProductsSidebar url={url} parentCategoryUrl={parentCategoryUrl} />,
    [url, parentCategoryUrl]
  )

  const handleSortMenuPress = () => openSidebar('sort')

  const handleFilterMenuPress = () => openSidebar('filter')

  return (
    <Container style={styles.headerContainer}>
      <CategorySortAndFilterTab
        disabled={disabled}
        title="sort"
        text={appliedSortOption?.label}
        onPress={handleSortMenuPress}
      />
      <Container style={styles.separator} />
      <CategorySortAndFilterTab
        title="filter"
        disabled={disabled}
        text={pluraliseString(appliedFiltersCount, 'filter')}
        onPress={handleFilterMenuPress}
      />
    </Container>
  )
}

export default CategorySortAndFilterTabs
