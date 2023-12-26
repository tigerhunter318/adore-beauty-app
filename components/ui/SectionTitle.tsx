import React from 'react'
import { StyleSheet } from 'react-native'
import Type from './Type'

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 28,
    textAlign: 'center',
    paddingBottom: 30
  }
})

type SectionTitleProps = {
  text: string
  highlightedText?: string
  style?: {}
}

const SectionTitle = ({ text, highlightedText, style = {} }: SectionTitleProps) => (
  <Type style={[styles.title, style]}>
    {text}
    <Type bold>{highlightedText || ''}</Type>
  </Type>
)

export default SectionTitle
