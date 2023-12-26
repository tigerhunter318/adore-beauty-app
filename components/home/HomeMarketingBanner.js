import React from 'react'
import Container from '../ui/Container'
import Type from '../ui/Type'
import AdoreSvgIcon from '../ui/AdoreSvgIcon'
import theme from '../../constants/theme'
import { isSameOrAfter, isSameOrBefore } from '../../utils/date'
import useUrlNavigation from '../../navigation/utils/useUrlNavigation'
import { gaEvents } from '../../services/ga'

const styles = {
  arrow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 10
  }
}

const HomeMarketingBanner = ({ data }) => {
  const urlNavigation = useUrlNavigation()
  const appMarketingBannerData = data?.find(item => item.identifier === 'App')

  const handleBannerPress = redirectUrl => {
    gaEvents.trackHomePromoBar()
    urlNavigation.push(redirectUrl, { fromScreenPath: undefined })
  }

  if (!appMarketingBannerData) {
    return null
  }

  const { url, title, description, publishDate, unPublishDate } = appMarketingBannerData?.items?.[0] || {}

  let isVisible = false

  if (publishDate && isSameOrBefore(publishDate)) {
    if (!unPublishDate) {
      isVisible = true
    } else if (isSameOrAfter(unPublishDate)) {
      isVisible = true
    }
  }

  if (!isVisible) {
    return null
  }

  const handleContainerPress = url ? () => handleBannerPress(url) : undefined

  return (
    <Container
      background={appMarketingBannerData?.backgroundColour}
      pv={0.5}
      pl={0.63}
      pr={2}
      onPress={handleContainerPress}
    >
      <Container background={theme.black} style={{ alignSelf: 'flex-start' }} ph={0.7}>
        <Type heading bold size={12} lineHeight={17} letterSpacing={1} color={theme.white}>
          {title || ''}
        </Type>
      </Container>
      <Container mt={0.6} ph={0.6}>
        <Type size={14} heading bold letterSpacing={1.5} lineHeight={14} color={theme.black}>
          {description || ''}
        </Type>
      </Container>
      <Container rows align style={styles.arrow} justify center>
        <AdoreSvgIcon name="ArrowRight" width={14.5} height={18} />
      </Container>
    </Container>
  )
}

export default HomeMarketingBanner
