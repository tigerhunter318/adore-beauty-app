import { useRef, useCallback, useState } from 'react'
import { isValidNumber } from '../utils/validation'

// TODO consider debounce, https://stackoverflow.com/a/60770167/1721636
const useScrollDirection = props => {
  const [isActive, setIsActive] = useState(false)
  const [direction, setDirection] = useState('')
  const scrollOffset = useRef(0)
  const { target } = props || {}

  const handleScroll = useCallback(
    event => {
      const currentOffset = event.nativeEvent.contentOffset.y
      const lastOffset = scrollOffset.current
      const dir = currentOffset > 0 && currentOffset > lastOffset ? 'down' : 'up'

      if (dir !== direction) {
        setDirection(dir)
      }

      if (isValidNumber(target)) {
        const active = currentOffset > target
        if (isActive !== active) {
          setIsActive(active)
        }
      }

      scrollOffset.current = currentOffset
    },
    [isActive, direction, target]
  )

  return {
    handleScroll,
    direction,
    offset: scrollOffset,
    isActive
  }
}

export default useScrollDirection
