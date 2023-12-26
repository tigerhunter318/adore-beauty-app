import { useEffect } from 'react'
import { useCategoryContext } from '../CategoryProvider'
import envConfig from '../../../config/envConfig'
import { isValidObject } from '../../../utils/validation'
import { deepClone } from '../../../utils/object'
import { parseUrlToFacets } from '../utils/parseUrlToFacets'

const allowMultipleSelections = name => !(name === 'price' || name === 'category' || name === 'subCategory')

const useCategoryFilters = (deps = []) => {
  const [url] = deps
  const { selectedFacets, setSelectedFacetsState, setAppliedSortOption } = useCategoryContext()

  const handleUrlChange = () => {
    const handleParseUrl = async () => {
      if (url) {
        const { order, ...rest } = await parseUrlToFacets(url)
        setSelectedFacetsState(rest)
        setAppliedSortOption(order)
      }
    }
    handleParseUrl()
  }

  const selectFacetOption = (name, optionCode) => {
    setSelectedFacetsState(prev => {
      const prevState = deepClone(prev)
      let current = prevState?.facets?.[name] || []
      const foundIndex = current?.findIndex(code => code === optionCode)
      if (foundIndex >= 0) {
        current.splice(foundIndex, 1)
      } else if (allowMultipleSelections(name)) {
        current = [...current, optionCode]
      } else {
        current = [optionCode]
      }

      return {
        ...prevState,
        facets: {
          ...prevState.facets,
          [name]: current?.length === 0 ? undefined : current
        }
      }
    })
  }

  const clearFacet = name => {
    setSelectedFacetsState(prev => {
      if (isValidObject(prev?.facets)) {
        const { facets } = prev
        delete facets[name]
        return {
          ...prev,
          facets
        }
      }

      return prev
    })
  }

  const resetFacets = async categoryUrl => {
    const { category } = await parseUrlToFacets(categoryUrl)
    setSelectedFacetsState({ category })
  }

  const getFacetOption = name => selectedFacets?.[name] || []

  const getPriceFilters = () => [...envConfig.hasura.categoryPriceFilters]

  let numOfActiveGroups = 0

  if (selectedFacets?.facets && Object.entries(selectedFacets?.facets)?.length > 0) {
    numOfActiveGroups = Object.entries(selectedFacets?.facets).reduce((acc, [key, val]: any) => {
      if (val?.length > 0) {
        return acc + val.length
      }
      return acc
    }, 0)
  }

  useEffect(handleUrlChange, [url])

  return {
    selectedFacets,
    selectFacetOption,
    clearFacet,
    resetFacets,
    numOfActiveGroups,
    getFacetOption,
    getPriceFilters,
    cloneSelectedFacets: () => deepClone(selectedFacets || {})
  }
}

export default useCategoryFilters
