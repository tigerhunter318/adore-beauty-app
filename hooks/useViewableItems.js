import { useCallback, useRef, useState } from 'react'

const useViewableItems = ({ keyName, itemType = 'product', initialNumToRender }) => {
  const initialNumToRenderRef = useRef(initialNumToRender)
  const viewableItemsRef = useRef([])
  const viewableItemsDataRef = useRef([])
  const [viewableItemsState, setViewableItemsState] = useState([])

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    const newItems = viewableItems.filter(item => !viewableItemsDataRef.current.find(item2 => item.key === item2.key))
    viewableItemsDataRef.current = [...viewableItemsDataRef.current, ...newItems]
    viewableItemsRef.current = viewableItemsDataRef.current.map(item => item.key).sort()
    if (viewableItemsRef.current.join() !== viewableItemsState.join()) {
      setViewableItemsState(viewableItemsRef.current) // trigger a render
    }
    initialNumToRenderRef.current = null // clear after first render
  }, [])

  const isItemViewable = useCallback((item, index) => {
    if (initialNumToRenderRef.current > 0 && index < initialNumToRender) {
      return true
    }
    const itemKey = keyExtractor(item, index)
    return !!viewableItemsRef.current.find(key => key === itemKey)
  }, [])

  const keyExtractor = useCallback(
    (item, index) => (item?.[keyName] ? `${index}-${itemType}-${item[keyName]}` : `${index}-${itemType}-${index}`),
    []
  )

  return {
    viewableItemsDataRef,
    viewableItemsState,
    handleViewableItemsChanged,
    isItemViewable,
    keyExtractor
  }
}

export default useViewableItems
