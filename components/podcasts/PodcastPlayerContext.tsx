import React, { useContext, createContext, useRef } from 'react'
import { BottomSheetToggleRef } from '../ui/CustomBottomSheet'
import useTrackPlayer from './useTrackPlayer'

type PodcastPlayerContextProps = {
  openPlayer: () => void | undefined
  minimizePlayer: () => void | undefined
  navigation: any
  trackPlayer: any
  isPodcastPage: boolean
  bottomSheetRef: React.RefObject<BottomSheetToggleRef>
  toggleBottomSheetOpen: (value: any) => void
}

const PodcastPlayerContext = createContext<PodcastPlayerContextProps>({} as PodcastPlayerContextProps)

export const usePodcastPlayerContext = () => useContext(PodcastPlayerContext)

const PodcastPlayerProvider = ({
  children,
  navigation,
  activeRoute
}: {
  children: JSX.Element
  navigation: any
  activeRoute: string
}) => {
  const bottomSheetRef = useRef<BottomSheetToggleRef>(null)
  const trackPlayer = useTrackPlayer()
  const isPodcastPage = !!['Podcasts', 'BeautyIQPodcastProgram', 'BeautyIQPodcastEpisode'].find(
    route => route === activeRoute
  )
  const toggleBottomSheetOpen = (value: any) => bottomSheetRef?.current?.toggleOpen(value)

  const minimizePlayer = () => toggleBottomSheetOpen(false)

  const openPlayer = () => toggleBottomSheetOpen(true)

  return (
    <PodcastPlayerContext.Provider
      value={{
        openPlayer,
        minimizePlayer,
        navigation,
        trackPlayer,
        isPodcastPage,
        bottomSheetRef,
        toggleBottomSheetOpen
      }}
    >
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerProvider
