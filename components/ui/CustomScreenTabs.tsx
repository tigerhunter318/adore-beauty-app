import React, { useEffect, useMemo, useRef, useState, forwardRef, useCallback, memo } from 'react'
import { TabViewProps, Route, TabView, NavigationState } from 'react-native-tab-view'
import { Animated, StyleSheet, View } from 'react-native'
import ReAnimated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { DEFAULT_FONT, DEFAULT_FONT_FAMILY } from './Type'
import { vw } from '../../utils/dimensions'
import theme from '../../constants/theme'
import Container from './Container'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: theme.borderColor
  },
  text: {
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  indicator: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'black',
    bottom: 0,
    left: 0
  }
})

type Measure = {
  x: number
  y: number
  width: number
  height: number
}

type CustomScreenTabsProps = {
  routes: { key: string; title: string; component: JSX.Element }[]
  resetCondition?: boolean
  lazy?: boolean
  swipeEnabled?: boolean
}

type TabBarTabProps = {
  onPress: (index: number) => void
  index: number
  opacity: Animated.AnimatedInterpolation
  ref: React.RefObject<any>
  title: string
  tabWidth: number
  isActiveTab: boolean
}

type TabBarTabsProps<T extends Route> = {
  tabs: any
  refs: any
  onPress: (index: number) => void
  tabWidth: number
  inputRange: number[]
  position: any
  navigationState: NavigationState<T>
}

type TabBarProps<T extends Route> = Parameters<NonNullable<TabViewProps<T>['renderTabBar']>>[0] & {
  onIndexChange: (index: number) => void
}

type TabBarIndicatorProps<T extends Route> = {
  position: Animated.AnimatedInterpolation
  inputRange: number[]
  tabWidth: number
}

const TabBarIndicator = <T extends Route>(props: TabBarIndicatorProps<T>) => {
  const { tabWidth, position, inputRange } = props
  const animation = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animation.value,
      inputRange,
      inputRange.map(_ => tabWidth)
    )

    const translateX = interpolate(animation.value, inputRange, [0, tabWidth])

    return {
      width,
      transform: [{ translateX }]
    }
  }, [])

  const handlePosition = () => {
    const id = position.addListener((value: { value: number }) => {
      animation.value = value.value
    })

    return () => position.removeListener(id)
  }

  useEffect(handlePosition, [animation, position])

  return <ReAnimated.View style={[styles.indicator, animatedStyle]} />
}

const TabBarTab = forwardRef<any, TabBarTabProps>(({ onPress, index, opacity, title, tabWidth, isActiveTab }, ref) => {
  const handlePress = useCallback(() => onPress(index), [index])

  return (
    <Container style={{ width: tabWidth, paddingVertical: 15, alignItems: 'center' }} onPress={handlePress}>
      <View ref={ref}>
        <Animated.Text
          style={[styles.text, { opacity, fontFamily: isActiveTab ? `${DEFAULT_FONT}-SemiBold` : DEFAULT_FONT_FAMILY }]}
        >
          {title}
        </Animated.Text>
      </View>
    </Container>
  )
})

const TabBarTabs = <T extends Route>(props: TabBarTabsProps<T>) => {
  const { tabs, refs, onPress, tabWidth, inputRange, position, navigationState } = props
  const renderTab = (tab: { title: string }, i: number) => {
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(inputRangeIndex => (inputRangeIndex === i ? 1 : 0.5))
    })

    return (
      <TabBarTab
        key={i}
        onPress={onPress}
        index={i}
        opacity={opacity}
        ref={refs[i]}
        tabWidth={tabWidth}
        title={tab.title}
        isActiveTab={navigationState.index === i}
      />
    )
  }

  return tabs.map(renderTab)
}

const TabBar = <T extends Route>(props: TabBarProps<T>) => {
  const containerRef = useRef<View | null>(null)
  const [measures, setMeasures] = useState<Measure[]>([])
  const { onIndexChange, position, navigationState } = props
  const { routes: tabs } = navigationState
  const inputRange = tabs.map((_, i) => i)
  const tabWidth = vw(100) / (inputRange.length || 1)

  const refs = useMemo(() => [...new Array(inputRange.length)].map(() => React.createRef<View>()), [inputRange.length])

  const handleMeasures = () => {
    const measureValues: Measure[] = []

    setTimeout(() => {
      refs.forEach(r => {
        if (!r.current) {
          return
        }

        r.current.measureLayout(
          containerRef.current as any,
          (x, y, width, height) => {
            measureValues.push({
              x,
              y,
              width,
              height
            })
          },
          () => {}
        )
      })

      setMeasures(measureValues)
    })
  }

  useEffect(handleMeasures, [refs])

  return (
    <View style={styles.container} ref={containerRef}>
      <TabBarTabs
        onPress={onIndexChange}
        tabs={tabs}
        refs={refs}
        tabWidth={tabWidth}
        inputRange={inputRange}
        position={position}
        navigationState={navigationState}
      />
      {measures?.length > 1 && navigationState?.routes?.length > 1 && (
        <TabBarIndicator inputRange={navigationState.routes.map((_, i) => i)} position={position} tabWidth={tabWidth} />
      )}
    </View>
  )
}

const CustomScreenTabs = ({
  routes,
  resetCondition = false,
  lazy = false,
  swipeEnabled = true
}: CustomScreenTabsProps) => {
  const [index, setIndex] = useState(0)
  const renderScene = ({ route: { component } }: { route: { component: JSX.Element } }) => component

  const handleTabReset = () => {
    if (resetCondition) {
      setIndex(0)
    }
  }

  useEffect(handleTabReset, [resetCondition])

  return (
    <TabView
      navigationState={{ index, routes }}
      // @ts-ignore
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={tabsProps => <TabBar {...tabsProps} onIndexChange={setIndex} />}
      initialLayout={{ width: vw(100) }}
      lazy={lazy}
      swipeEnabled={swipeEnabled}
    />
  )
}

export default memo(CustomScreenTabs)
