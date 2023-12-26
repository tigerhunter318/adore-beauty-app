import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { Timeout } from '../../../config/types'
import theme from '../../../constants/theme'
import { isIos } from '../../../utils/device'
import SearchBox from '../../ui/SearchBox'

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 17,
    backgroundColor: theme.lightGrey
  },
  input: {
    paddingVertical: isIos() ? 19.5 : 14.5,
    paddingLeft: 29,
    paddingRight: 29
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    bottom: 16,
    zIndex: 9
  },
  clearIcon: {
    position: 'absolute',
    right: 5.5,
    bottom: 8,
    zIndex: 9
  }
})

type SearchRefinementsSearchBoxProps = {
  onChange: (a: string) => void
}

export type SearchRefinementsSearchBoxRef = {
  clear: () => void
}

const SearchRefinementsSearchBox = (
  { onChange }: SearchRefinementsSearchBoxProps,
  ref: React.Ref<SearchRefinementsSearchBoxRef>
) => {
  const inputRef = useRef<TextInput>(null)
  const timeoutRef = useRef<null | Timeout>(null)
  const [inputValue, setInputValue] = useState('')

  const onChangeText = (newValue: string) => {
    setInputValue(newValue)
    clearTimeout(timeoutRef.current as Timeout)
    timeoutRef.current = setTimeout(() => {
      onChange(newValue)
    }, 200)
  }

  const handleInputFocus = () => {
    inputRef?.current?.focus()
    onChangeText('')
  }

  const clear = () => {
    inputRef?.current?.clear()
  }

  useImperativeHandle(ref, () => ({
    clear
  }))

  return (
    <SearchBox
      placeholder="Search"
      ref={inputRef}
      inputValue={inputValue}
      onChangeText={onChangeText}
      onClearPress={handleInputFocus}
      containerStyles={styles.container}
      inputStyles={styles.input}
      searchIconStyles={styles.searchIcon}
      clearIconStyles={styles.clearIcon}
    />
  )
}

export default forwardRef(SearchRefinementsSearchBox)
