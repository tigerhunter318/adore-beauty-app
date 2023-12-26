import React from 'react'
import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils'
import { isValidArray } from '../../utils/validation'
import { capitalize } from '../../utils/case'
import { sanitizeContent } from '../../utils/format'
import Type from '../ui/Type'
import Container from '../ui/Container'
import theme from '../../constants/theme'

type HighlightPartProps = {
  children: string
  isHighlighted: boolean
  partIndex: number
}

type SearchSuggestionsHitsHighlightItemProps = {
  highlightResult?: Record<string, any> | undefined
  highlighted?: string
}

const HighlightPart = ({ children, isHighlighted, partIndex }: HighlightPartProps) => (
  <Type color={isHighlighted ? theme.black : theme.lightBlack} size={13} semiBold={isHighlighted} numberOfLines={1}>
    {partIndex === 0 ? capitalize(children) : children}
  </Type>
)

const SearchSuggestionsHitsHighlightItem = ({
  highlightResult,
  highlighted
}: SearchSuggestionsHitsHighlightItemProps) => {
  const highlightedValue = highlightResult ? getPropertyByPath(highlightResult, 'query')?.value : highlighted
  const parts = getHighlightedParts(highlightedValue || '')

  if (parts?.find(({ value }) => /&lt/.test(value))) return <Container mb={3.6} />

  return (
    <Container rows>
      {parts.map((part: any, partIndex: number) => {
        if (isValidArray(part)) {
          const isLastPart = partIndex === parts.length - 1
          return (
            <Container key={partIndex}>
              {part.map((subPart: { isHighlighted: any; value: any }, subPartIndex: React.Key | null | undefined) => (
                <HighlightPart key={subPartIndex} partIndex={partIndex} isHighlighted={subPart.isHighlighted}>
                  {subPart.value}
                </HighlightPart>
              ))}
              {!isLastPart && ', '}
            </Container>
          )
        }

        return (
          <HighlightPart key={partIndex} partIndex={partIndex} isHighlighted={part.isHighlighted}>
            {sanitizeContent(part.value)}
          </HighlightPart>
        )
      })}
    </Container>
  )
}

export default SearchSuggestionsHitsHighlightItem
