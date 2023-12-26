import { useEffect, useRef } from 'react'

const useViewedItemsTracking = ({ state, itemsRef, onUpdate, debounce = 2000 }) => {
  const trackedItemsRef = useRef([])

  const handleTimeout = () => {
    const newItems = itemsRef.current.filter(item => !trackedItemsRef.current.find(item2 => item.key === item2.key))
    trackedItemsRef.current = [...trackedItemsRef.current, ...newItems]
    if (newItems?.length > 0) {
      onUpdate(newItems.map(item => item.item))
    }
  }
  useEffect(() => {
    const timeout = setTimeout(handleTimeout, debounce)
    return () => {
      clearTimeout(timeout)
    }
  }, [state, debounce])
}
export default useViewedItemsTracking
