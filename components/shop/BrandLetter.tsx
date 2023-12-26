import React from 'react'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import Type from '../ui/Type'

const styles = {
  tile: {
    width: `${(1 / 7) * 100}%`,
    height: 40,
    margin: 1
  },
  wideTile: {
    width: `${(1 / 7) * 100 + 7.6}%`,
    height: 40,
    margin: 1
  }
}

type BrandLetterProps = {
  letter: string
  wide?: boolean
  selectedBrand: string
  onSelect: (letter: string) => void
  isDisabled: boolean
}

const BrandLetter = ({ letter, wide, selectedBrand, onSelect, isDisabled }: BrandLetterProps) => {
  const brand = wide ? 'U-Z' : letter
  const activeLetter = selectedBrand === brand
  const style = wide ? styles.wideTile : styles.tile
  const background = activeLetter ? theme.black : theme.white
  const color = activeLetter ? theme.white : theme.lighterBlack
  return (
    <Container
      background={background}
      style={[style, { borderWidth: 1, borderColor: activeLetter ? theme.black : theme.borderColor }]}
      center
      justify
      onPress={() => onSelect(brand)}
      disabled={isDisabled}
    >
      <Type size={13} color={isDisabled ? theme.textGrey : color} semiBold bold={activeLetter}>
        {brand}
      </Type>
    </Container>
  )
}

export default BrandLetter
