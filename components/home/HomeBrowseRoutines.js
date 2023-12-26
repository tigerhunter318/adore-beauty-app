import React from 'react'
import Container from '../ui/Container'
import ArticleCategory from '../article/ArticleCategory'
import { withNavigation } from '../../navigation/utils'
import { useScreenRouter } from '../../navigation/router/screenRouter'
import { formatPageIdentifier } from '../../utils/format'
import SectionTitle from '../ui/SectionTitle'

const HomeBrowseRoutines = ({ categories, categoryType }) => {
  const { navigateScreen } = useScreenRouter()

  const handleCategory = async item => {
    navigateScreen('MainTab/BeautyIQ/BeautyIQ/Articles', { slug: formatPageIdentifier(item.url) })
  }

  return (
    <Container>
      <SectionTitle text="browse " highlightedText="routines" />
      {/* categories */}
      {categories && (
        <Container rows justify>
          {categories.map(item => (
            <ArticleCategory
              {...item}
              key={item.url}
              type={categoryType}
              containerProps={{
                ph: 1,
                onPress: () => {
                  handleCategory(item)
                }
              }}
            />
          ))}
        </Container>
      )}
    </Container>
  )
}

export default withNavigation(HomeBrowseRoutines)
