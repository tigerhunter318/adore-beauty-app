import React, { useEffect, useState } from 'react'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import { TouchableOpacity } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useClearRefinements } from 'react-instantsearch-hooks'
import { useClearAttributeRefinement, useProductAttributes } from '../hooks'
import SidebarSheet from '../../sidebar/SidebarSheet'
import SearchProductsFilter from './SearchProductsFilter'
import SearchProductsRefinements from './SearchProductsRefinements'
import { ViewItemsButton } from '../../ui/ViewItemsButton'
import { useSidebar } from '../../sidebar/SidebarContext'
import Container from '../../ui/Container'
import { useSafeInsets, vh } from '../../../utils/dimensions'
import SearchProductsSort from './SearchProductsSort'
import { useSearchContext } from '../SearchProvider'
import { useTranslateAnimation } from '../../../utils/animate'
import Header from '../../ui/Header'
import Icon from '../../ui/Icon'

export const DebugSearchProductsSidebar = () => {
  const { sidebarType, setSidebarType } = useSearchContext()
  const handleClose = () => {
    setSidebarType(null)
  }
  const right = sidebarType ? 0 : 500
  return (
    <SidebarSheet style={{ backgroundColor: 'rgba(0,0,0,0.0)', right }}>
      <TouchableOpacity onPress={handleClose}>
        <SidebarSheet style={{ zIndex: 2, width: '100%', height: 700, backgroundColor: 'rgba(0,255,0,0.5)' }} />
      </TouchableOpacity>
      <SidebarSheet style={{ width: '70%', right }}>
        <SearchProductsSidebar />
      </SidebarSheet>
    </SidebarSheet>
  )
}

type AttributeType = {
  attribute: string
  label: string
}

const SearchProductsSidebar = () => {
  const [selected, setSelected] = useState<AttributeType>()
  const { sidebarType } = useSearchContext()
  const { closeDrawer } = useSidebar()
  const isDrawerOpen = useIsDrawerOpen()
  const { bottom: safeBottomPadding = 200 } = useSafeInsets()
  const { refine: clearAllRefinements } = useClearRefinements()
  const { clearRefinement } = useClearAttributeRefinement()
  const attributes = useProductAttributes() as AttributeType[]

  const handleSelectAttribute = (attribute: string, label: string) => {
    setSelected({ attribute, label })
  }

  const handleSideBarReset = () => {
    setSelected(undefined)
  }

  useEffect(handleSideBarReset, [isDrawerOpen, sidebarType])

  const footerComponent = (
    <Container mb={safeBottomPadding / 10}>
      <ViewItemsButton onPress={closeDrawer} />
    </Container>
  )

  const animationRef = useSharedValue(0)
  const animatedStyle = useTranslateAnimation({
    animationType: 'translateX',
    animationRef,
    visibleValue: 400,
    isVisible: !!selected?.attribute
  })

  const onBackPress = () => {
    if (selected?.label) {
      setSelected(undefined)
    } else {
      closeDrawer()
    }
  }

  const onRightPress = () => {
    if (sidebarType === 'filter') {
      if (selected?.attribute) {
        clearRefinement(selected.attribute)
      } else {
        clearAllRefinements()
      }
    }
  }

  return (
    <SidebarSheet style={{ height: vh(100) }}>
      <SidebarSheet>
        <Header
          title={sidebarType}
          onRightPress={onRightPress}
          right={sidebarType === 'filter' && <Icon name="refresh" type="material" color="white" size={24} />}
        />
        <SearchProductsSort isVisible={sidebarType === 'sort'} />
        <SearchProductsFilter
          onSelectAttribute={handleSelectAttribute}
          isVisible={sidebarType === 'filter' && isDrawerOpen && !selected?.attribute}
        />
      </SidebarSheet>
      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <SidebarSheet style={{ zIndex: 2 }} footerComponent={!!selected?.attribute && footerComponent}>
          <Header
            title={selected?.label}
            hasBack
            onRightPress={onRightPress}
            onBackPress={onBackPress}
            right={<Icon name="refresh" type="material" color="white" size={24} />}
          />
          {attributes?.map((item: AttributeType) => (
            <SearchProductsRefinements
              attribute={item.attribute}
              key={item.attribute}
              isVisible={sidebarType === 'filter' && selected?.attribute === item.attribute && isDrawerOpen}
            />
          ))}
        </SidebarSheet>
      </Animated.View>
    </SidebarSheet>
  )
}

export default SearchProductsSidebar
