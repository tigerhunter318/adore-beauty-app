/**
 * reference
 * // https://github.com/react-navigation/react-navigation/blob/8a95fb588bd1f8a72fc4ef4e847f06e103ed55fe/packages/stack/src/TransitionConfigs/CardStyleInterpolators.tsx
 *
 * useCardAnimation
 * https://stackoverflow.com/a/64759847/1721636
 *
 * @param duration
 */
import { StackCardInterpolatedStyle, StackCardInterpolationProps, TransitionSpecs } from '@react-navigation/stack'
import { Animated, Easing } from 'react-native'
import { TransitionSpec } from '@react-navigation/stack/src/types'
import conditional from './utils/conditional'

const { add, multiply } = Animated

export const forFadeScreen = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: { opacity: current.progress }
})

const FadeInSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: 350,
    easing: Easing.out(Easing.poly(5))
  }
}

/**
 * ported from https://github.com/react-navigation/react-navigation/blob/8a95fb588bd1f8a72fc4ef4e847f06e103ed55fe/packages/stack/src/TransitionConfigs/CardStyleInterpolators.tsx
 *
 * @param current
 * @param inverted
 * @param screen
 */
export function forPushFade({
  current,
  inverted,
  closing,
  layouts: { screen }
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const { progress } = current
  const translateY = multiply(
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-40, 0],
      extrapolate: 'clamp'
    }),
    inverted
  )

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
    extrapolate: 'clamp'
  })
  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 0.9, 1],
    outputRange: [0, 0.25, 0.7, 1]
  })

  return {
    cardStyle: {
      transform: [{ scale }, { translateY }],
      opacity
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp'
      })
    }
  }
}

export const searchOpenAnimation = (duration = 0) => ({
  cardStyleInterpolator: forPushFade,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.out(Easing.poly(5))
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 100,
        easing: Easing.linear
      }
    }
  }
})
