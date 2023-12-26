import React from 'react'
import { StyleSheet } from 'react-native'
import { ResultTabs } from '../ui/ResultTabs'
import { pluraliseString } from '../../utils/format'
import { vw } from '../../utils/dimensions'
import { useProductResultsSortOption, useResults, useSearchProductsSidebar } from './hooks'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import Type from '../ui/Type'
import SearchProductsSidebar from './widgets/SearchProductsSidebar'
import ContentLoading from '../ui/ContentLoading'

const styles = StyleSheet.create({
  tabStyle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
    justifyContent: 'center'
  },
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
    height: 56,
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

type SearchSortAndFilterTabProps = {
  onPress?: () => void
  title?: string
  text?: string
  disabled?: boolean
}

const SearchSortAndFilterTab = ({ onPress, title, text, disabled = false }: SearchSortAndFilterTabProps) => (
  <Container onPress={onPress} disabled={disabled}>
    <Container style={styles.tab}>
      <Type bold style={styles.tabTitle} color={disabled ? theme.black50 : theme.black}>
        {title}
      </Type>
      <Type style={styles.tabText} color={disabled ? theme.black50 : theme.lighterBlack}>
        {text}
      </Type>
    </Container>
  </Container>
)

type SearchResultsHeaderProps = {
  onChangeTab: (category: string) => void
  searchResultCategory: string
  productIndex: string
  resultsCountState: any
}

const SearchResultsHeader = ({
  onChangeTab,
  searchResultCategory,
  productIndex,
  resultsCountState
}: SearchResultsHeaderProps) => {
  const sortByOption = useProductResultsSortOption(productIndex)
  const { processingTimeMS = 0, nbHits, nbRefinements } = useResults(productIndex) || {}
  const loading: boolean = processingTimeMS === 0
  const noResults: boolean = nbHits === 0 && nbRefinements === 0
  const activeTab: string = searchResultCategory
  const disabled: boolean = activeTab === 'articles' || noResults || loading
  const tabsData = ['products', 'articles'].map(name => ({
    name: `${resultsCountState[name].nbHits || 0} ${name}`,
    active: activeTab === name,
    onPress: () => onChangeTab(name),
    disabled: !resultsCountState[name].nbHits
  }))
  const isCountLoading = resultsCountState.articles.loading !== false

  const { openSidebar } = useSearchProductsSidebar(<SearchProductsSidebar />, [])

  const handleSortMenuPress = () => openSidebar('sort')

  const handleFilterMenuPress = () => openSidebar('filter')

  return (
    <Container style={styles.tabStyle}>
      <Container style={styles.headerContainer} justify="space-between">
        <SearchSortAndFilterTab
          title="sort"
          text={sortByOption?.label || 'RECOMMENDED'}
          onPress={handleSortMenuPress}
          disabled={disabled}
        />
        <Container style={styles.separator} />
        <SearchSortAndFilterTab
          title="filter"
          text={pluraliseString(nbRefinements, 'filter')}
          onPress={handleFilterMenuPress}
          disabled={disabled}
        />
      </Container>
      {isCountLoading && (
        <Container style={{ height: 56 }}>
          <ContentLoading height={56} type="ResultsCount" />
        </Container>
      )}
      {!isCountLoading && <ResultTabs tabs={tabsData} />}
    </Container>
  )
}

export default SearchResultsHeader
