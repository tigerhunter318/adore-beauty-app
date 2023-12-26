import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const useAnimationRef = (initialValue = 0) => useRef(new Animated.Value(initialValue)).current

/**

 const translateX = useAnimationRef(0)
 useEffect(() => {
    animate(translateX, {toValue:100})
  }, [isVisible])
 return (
  <Animated.View style={{ transform: [{ translateX }] }} ></Animated.View>
 )

 *
 * @param animateValueRef
 * @param to
 * @param duration
 * @param rest
 */
const animate = (animateValueRef, { toValue, duration = 300, ...rest }) =>
  Animated.timing(animateValueRef, {
    toValue,
    duration,
    useNativeDriver: true,
    ...rest
  }).start()

const useStylesAnimation = ({
  duration = 300,
  active = false,
  initialValue = 0,
  activeValue = 1,
  initialStyle = {
    // opacity:0,
  },
  activeStyle = {
    // opacity:1,
  },
  easing = undefined
}) => {
  const animationRef = useSharedValue(initialValue) // starting value

  const animatedStyle = useAnimatedStyle(() => {
    const getValue = (key, progress) => {
      const range = activeStyle[key] - initialStyle[key]
      const val = initialStyle[key] + range * progress
      return val
    }
    const style = {}
    Object.keys(initialStyle).forEach(key => {
      style[key] = getValue(key, animationRef.value)
    })
    return style
  })

  const handleChange = () => {
    const toValue = active ? activeValue : initialValue
    return (animationRef.value = withTiming(toValue, { duration, easing: easing ?? Easing.linear }))
  }

  useEffect(handleChange, [active])
  return animatedStyle
}

const useTranslateAnimation = ({
  animationType = 'translateY',
  animationRef,
  isVisible = false,
  visibleValue = 100,
  duration = 200
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (animationType === 'translateY') {
      return {
        transform: [{ translateY: animationRef.value }]
      }
    }
    if (animationType === 'translateX') {
      return {
        transform: [{ translateX: animationRef.value }]
      }
    }
  }, [isVisible])

  const updateSharedValue = () => (animationRef.value = withTiming(isVisible ? 0 : visibleValue, { duration }))

  useEffect(updateSharedValue, [isVisible])

  return animatedStyle
}

export { animate, useAnimationRef, useTranslateAnimation, useStylesAnimation }
