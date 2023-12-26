import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import Container from '../ui/Container'
import Type from '../ui/Type'
import CustomButton from '../ui/CustomButton'
import theme from '../../constants/theme'
import PodcastEpisodesList from './PodcastEpisodesList'
import { usePodcastPlayerContext } from './PodcastPlayerContext'
import { vh } from '../../utils/dimensions'

const styles = StyleSheet.create({
  tabText: {
    fontSize: 13,
    letterSpacing: 1.18,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  borderStyle: {
    borderBottomWidth: 1.5,
    borderColor: theme.black
  }
})

const PodcastTabsTile = ({ name, isActiveTab, onPress }) => (
  <Container flex={1} pb={1.2} onPress={onPress} style={isActiveTab && styles.borderStyle}>
    <Type style={styles.tabText} center color={isActiveTab ? theme.black : theme.tabTextColor} semiBold={isActiveTab}>
      {name}
    </Type>
  </Container>
)

const PodcastTabsTiles = ({ tabTiles, activeIndex, onPress }) => (
  <Container rows ph={2} mb={2}>
    {tabTiles.map((title, index) => (
      <PodcastTabsTile name={title} key={index} isActiveTab={activeIndex === index} onPress={() => onPress(index)} />
    ))}
  </Container>
)

const PodcastTabs = ({ episodes, TabHeaderComponent, ...props }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { trackPlayer } = usePodcastPlayerContext()
  const { queue } = trackPlayer
  const showQueue = selectedTabIndex === 1
  const items = showQueue ? queue : episodes

  const handleClearQueue = async () => {
    await trackPlayer.resetPlayer()
    setSelectedTabIndex(0)
  }

  return (
    <Container flexGrow={1}>
      <PodcastEpisodesList
        episodes={items}
        {...props}
        ListHeaderComponent={
          <>
            {TabHeaderComponent}
            <PodcastTabsTiles
              tabTiles={['Episodes', `Queue (${trackPlayer.queue.length})`]}
              activeIndex={selectedTabIndex}
              onPress={setSelectedTabIndex}
            />
            {showQueue && !!queue?.length && (
              <CustomButton
                background={theme.black}
                color={theme.white}
                semiBold
                ml={2}
                mr={2}
                mb={2}
                onPress={handleClearQueue}
              >
                clear queue
              </CustomButton>
            )}
          </>
        }
        ListFooterComponent={
          showQueue && !queue?.length ? (
            <Type style={{ height: vh(30) }} center pt={6} ph={2}>
              There are no episodes currently in your queue.
            </Type>
          ) : null
        }
      />
    </Container>
  )
}

export default PodcastTabs
