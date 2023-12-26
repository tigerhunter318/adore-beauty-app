import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { View } from 'react-native'
import { isIos } from '../../utils/device'
import { vh } from '../../utils/dimensions'
import FooterBarButton from './FooterBarButton'
import { useTranslateAnimation } from '../../utils/animate'

type CustomBottomSheetHeaderProps = {
  style: {} | any
  title: string
  contentHeight: number | undefined
  onPress: () => void
  hasClose: boolean
  containerStyle: {} | any
}

const CustomBottomSheetHeader = ({
  style = {},
  title,
  contentHeight,
  onPress,
  hasClose,
  containerStyle
}: CustomBottomSheetHeaderProps) => {
  if (!title) return null

  return (
    <Animated.View style={style}>
      <FooterBarButton
        title={title}
        onPress={onPress}
        hasClose={hasClose}
        containerStyle={containerStyle}
        contentHeight={contentHeight}
      />
    </Animated.View>
  )
}

type CustomBottomSheetContentProps = {
  callbackNode: any
  children: JSX.Element
  isVisible: boolean
  style: {} | any
  containerStyle: {} | any
}

const CustomBottomSheetContent = ({
  callbackNode,
  children,
  isVisible,
  style = {},
  containerStyle = {}
}: CustomBottomSheetContentProps) => {
  const opacity = Animated.interpolateNode(callbackNode, {
    inputRange: [0, 1],
    outputRange: [1, 0]
  })

  return (
    <View style={[{ backgroundColor: 'white' }, containerStyle]}>
      {isVisible && <Animated.View style={[style, { opacity }]}>{children}</Animated.View>}
    </View>
  )
}

export type BottomSheetToggleRef = {
  toggleOpen: (value: any) => void
}

type CustomBottomSheetProps = {
  content: JSX.Element
  title: string | any
  isHeaderVisible: boolean
  hasBackdrop?: boolean
  hasHeaderClose?: boolean
  enablePanDownToClose?: boolean
  height?: number
  headerHeight?: number
  onOpenChange?: (open: boolean) => void
  onHeaderPress?: () => void
  headerStyle?: {} | any
  contentStyle?: {} | any
  contentContainerStyle?: {} | any
  bottomSheetProps?: {} | any
}

/**
 * Wrapper component for https://gorhom.github.io/react-native-bottom-sheet/
 * usage <CustomBottomSheet content={<Container/>} />
 */
const CustomBottomSheet = (
  {
    content,
    title,
    isHeaderVisible = true,
    hasBackdrop = true,
    hasHeaderClose = true,
    enablePanDownToClose = false,
    height = vh(50),
    headerHeight = 48,
    onOpenChange,
    headerStyle = {},
    contentStyle = {},
    contentContainerStyle = {},
    onHeaderPress,
    bottomSheetProps = {}
  }: CustomBottomSheetProps,
  ref: React.Ref<BottomSheetToggleRef>
) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const defaultRef = useRef<BottomSheetToggleRef>(null)
  const componentRef = ref || defaultRef
  const animationRef = useSharedValue(0)
  const callbackNode = new Animated.Value(0)
  const openRef = useRef(false)
  const startY = !!title && !isOpen ? headerHeight : 1
  const animatedStyle = useTranslateAnimation({
    animationRef,
    isVisible: isHeaderVisible
  })

  const toggleOpen = (open = null) => {
    if (bottomSheetRef?.current) {
      if (open !== null) {
        bottomSheetRef.current.snapToIndex(open ? 1 : 0)
      } else {
        bottomSheetRef.current.snapToIndex(openRef.current ? 0 : 1)
      }
    }
  }

  const handleHeaderPress = () => {
    if (isHeaderVisible) {
      if (onHeaderPress) {
        onHeaderPress()
      }
      toggleOpen()
    }
  }

  const handleAnimateStart = useCallback((fromIndex, toIndex) => {
    const open = toIndex > 0
    openRef.current = open
    setIsOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }, [])

  const renderHeader = () => (
    <CustomBottomSheetHeader
      title={title}
      style={[
        animatedStyle,
        {
          opacity: hasHeaderClose && isOpen ? 1 : 0.85
        },
        headerStyle
      ]}
      hasClose={!!(hasHeaderClose && isOpen)}
      contentHeight={isOpen ? undefined : headerHeight}
      onPress={handleHeaderPress}
      containerStyle={{ position: 'relative', bottom: 'auto' }}
    />
  )

  const renderContent = () => (
    <CustomBottomSheetContent
      callbackNode={callbackNode}
      isVisible={!!isOpen}
      style={contentStyle}
      containerStyle={contentContainerStyle}
    >
      {content}
    </CustomBottomSheetContent>
  )

  // renders
  const renderBackdrop = useCallback(
    props =>
      hasBackdrop ? (
        <BottomSheetBackdrop {...props} opacity={0.7} pressBehavior={0} disappearsOnIndex={0} appearsOnIndex={1} />
      ) : null,
    []
  )

  useImperativeHandle(componentRef, () => ({
    bottomSheetRef,
    isOpen,
    toggleOpen
  }))

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        enableContentPanningGesture={isIos()}
        snapPoints={[startY, height]}
        handleComponent={renderHeader}
        onAnimate={handleAnimateStart}
        backgroundComponent={() => null}
        {...bottomSheetProps}
      >
        {renderContent()}
      </BottomSheet>
    </>
  )
}

export default forwardRef(CustomBottomSheet)
