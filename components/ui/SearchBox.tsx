import React, { forwardRef } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import theme from '../../constants/theme'
import Container from './Container'
import Icon from './Icon'
import { DEFAULT_FONT_FAMILY } from './Type'

const styles = StyleSheet.create({
  searchIcon: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    zIndex: 9
  },
  clearIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 9,
    height: 40,
    width: 40
  }
})

type SearchBoxProps = {
  inputValue: string
  placeholder: string
  onChangeText: (text: string) => void
  onClearPress: () => void
  onBlur?: any
  onFocus?: any
  onSubmitEditing?: any
  containerStyles?: {}
  inputStyles?: {}
  searchIconStyles?: {}
  clearIconStyles?: {}
  testID?: string
}

const SearchBox = (
  {
    placeholder,
    inputValue,
    containerStyles,
    inputStyles,
    searchIconStyles,
    clearIconStyles,
    onChangeText,
    onSubmitEditing,
    onClearPress,
    onFocus,
    onBlur,
    testID
  }: SearchBoxProps,
  ref: React.Ref<TextInput>
) => (
  <Container style={containerStyles}>
    <Container style={[styles.searchIcon, searchIconStyles]}>
      <Icon type="ion" name="ios-search" size={24} />
    </Container>
    <TextInput
      testID={testID}
      ref={ref}
      style={[inputStyles, { fontFamily: DEFAULT_FONT_FAMILY }]}
      value={inputValue}
      onChangeText={onChangeText}
      autoCapitalize="none"
      allowFontScaling={false}
      autoCorrect={false}
      spellCheck={false}
      placeholder={placeholder}
      onSubmitEditing={onSubmitEditing}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholderTextColor={theme.darkGray}
      returnKeyType="search"
      numberOfLines={1}
    />
    {!!inputValue && (
      <Container
        align
        justify
        style={[styles.clearIcon, clearIconStyles]}
        onPress={onClearPress}
        testID={`${testID}.inputClearIcon`}
      >
        <Icon name="close" type="material" size={20} color={theme.black40} />
      </Container>
    )}
  </Container>
)

export default forwardRef(SearchBox)
