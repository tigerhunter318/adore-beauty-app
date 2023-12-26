import React from 'react'
import { isValidArray, isValidNumber } from '../../utils/validation'
import Container from '../ui/Container'
import BrandLetter from './BrandLetter'
import BrandShowAll from './BrandShowAll'

type BrandFilterByLetterProps = {
  brandLetters?: any
  selectedLetter: string
  selectLetter: (letter: string) => void
  isDisabled?: boolean
  justify?: string
}

const BrandFilterByLetter = ({
  brandLetters = null,
  selectLetter,
  selectedLetter,
  isDisabled = false,
  justify = 'center'
}: BrandFilterByLetterProps) => {
  let letters = brandLetters

  if (!isValidArray(brandLetters)) {
    letters = Array.from('ABCDEFGHIJKLMNOPQRSTU')
  }

  const isWideLetter = (letter: string) => !isValidArray(brandLetters) && letter > 'T'
  const hasPromoBrandIntegers = !!brandLetters?.find(isValidNumber)

  return (
    <Container rows justify={justify} style={{ flexWrap: 'wrap' }}>
      {letters.map((letter: string, index: number) => (
        <BrandLetter
          letter={isWideLetter(letter) ? 'U-Z' : letter}
          wide={isWideLetter(letter)}
          key={`brand-${letter}-${index}`}
          selectedBrand={selectedLetter}
          onSelect={selectLetter}
          isDisabled={isDisabled}
        />
      ))}
      {(hasPromoBrandIntegers || !brandLetters) && (
        <BrandLetter letter="#" selectedBrand={selectedLetter} onSelect={selectLetter} isDisabled={isDisabled} />
      )}
      <BrandShowAll selectedBrand={selectedLetter} onSelect={selectLetter} />
    </Container>
  )
}

export default BrandFilterByLetter
