import React from 'react'
import Container from '../ui/Container'
import theme from '../../constants/theme'
import Type from '../ui/Type'

const styles = {
  tile: {
    width: `${(1 / 7) * 100 + 7.5}%`,
    height: 40,
    borderWidth: 1,
    marginTop: 1,
    marginRight: 1,
    marginLeft: 1
  }
}

type BrandShowAllProps = {
  onSelect: (letter: string) => void
  selectedBrand: string
}

const BrandShowAll = ({ onSelect, selectedBrand }: BrandShowAllProps) => {
  const background = selectedBrand ? theme.white : theme.black
  const color = !selectedBrand ? theme.white : theme.lighterBlack

  return (
    <Container
      background={background}
      style={[styles.tile, { borderColor: !selectedBrand ? theme.black : theme.borderColor }]}
      center
      justify
      onPress={() => onSelect('show_all')}
    >
      <Type size={11} center color={color} semiBold bold={!selectedBrand}>
        SHOW{'\n'}ALL
      </Type>
    </Container>
  )
}

export default BrandShowAll
