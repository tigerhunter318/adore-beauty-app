import React, { useEffect, useState } from 'react'
import { useIsDrawerOpen } from '@react-navigation/drawer'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { ViewItemsButton } from '../ui/ViewItemsButton'
import { useSidebar } from '../sidebar/SidebarContext'
import { useSafeInsets, vh } from '../../utils/dimensions'
import { useTranslateAnimation } from '../../utils/animate'
import { useCategoryContext } from './CategoryProvider'
import { isValidArray, isValidObject } from '../../utils/validation'
import SidebarSheet from '../sidebar/SidebarSheet'
import Container from '../ui/Container'
import Header from '../ui/Header'
import Icon from '../ui/Icon'
import CategoryProductsSort from './CategoryProductsSort'
import CategoryProductsFacets from './CategoryProductsFacets'
import CategoryProductsFacetOptions from './CategoryProductsFacetOptions'
import useCategoryFilters from './hooks/useCategoryFilters'
import theme from '../../constants/theme'

const CategoryProductsSidebar = ({ url, parentCategoryUrl }: { url: string; parentCategoryUrl: string }) => {
  const [selected, setSelected] = useState<any>()
  const { clearFacet, resetFacets, numOfActiveGroups } = useCategoryFilters()
  const { sidebarType } = useCategoryContext()
  const { closeDrawer } = useSidebar()
  const isDrawerOpen = useIsDrawerOpen()
  const { bottom: safeBottomPadding = 200 } = useSafeInsets()
  const animationRef = useSharedValue(0)
  const animatedStyle = useTranslateAnimation({
    animationType: 'translateX',
    animationRef,
    visibleValue: 400,
    isVisible: isValidObject(selected)
  })
  const isResetButtonDisabled = numOfActiveGroups === 0

  const onBackPress = () => {
    if (selected?.label) {
      setSelected(undefined)
    } else {
      closeDrawer()
    }
  }

  const onRightPress = () => {
    if (sidebarType === 'filter') {
      if (selected?.code) {
        clearFacet(selected?.code)
      } else {
        resetFacets(url)
      }
    }
  }

  const handleSelectOption = (payload: {}) => {
    setSelected(payload)
  }

  const handleSideBarReset = () => {
    setSelected(undefined)
  }

  useEffect(handleSideBarReset, [isDrawerOpen, sidebarType])

  return (
    <SidebarSheet style={{ height: vh(100) }}>
      <SidebarSheet>
        <Header
          title={sidebarType}
          onRightPress={onRightPress}
          right={
            sidebarType === 'filter' && (
              <Icon
                name="refresh"
                type="material"
                color={isResetButtonDisabled ? theme.textGreyDark : theme.white}
                size={24}
              />
            )
          }
        />
        <CategoryProductsSort isVisible={sidebarType === 'sort'} />
        {sidebarType === 'filter' && isDrawerOpen && !isValidObject(selected) && (
          <CategoryProductsFacets onChange={handleSelectOption} url={url} parentCategoryUrl={parentCategoryUrl} />
        )}
      </SidebarSheet>
      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <SidebarSheet
          style={{ zIndex: 2 }}
          footerComponent={
            isValidObject(selected) && (
              <Container mb={safeBottomPadding / 10}>
                <ViewItemsButton onPress={closeDrawer} />
              </Container>
            )
          }
        >
          <Header
            title={selected?.label || sidebarType}
            hasBack
            onRightPress={onRightPress}
            onBackPress={onBackPress}
            right={
              <Icon
                name="refresh"
                type="material"
                color={isResetButtonDisabled ? theme.textGreyDark : theme.white}
                size={24}
              />
            }
          />
          {isValidObject(selected) && <CategoryProductsFacetOptions {...selected} url={url} />}
        </SidebarSheet>
      </Animated.View>
    </SidebarSheet>
  )
}

export default CategoryProductsSidebar
