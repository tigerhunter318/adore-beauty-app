import { useEffect } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'

type VirtualSearchBoxProps = { query?: string } & UseSearchBoxProps
const VirtualSearchBox = ({ query, ...props }: VirtualSearchBoxProps) => {
  const { refine } = useSearchBox(props)

  const handleRefine = () => {
    refine(query || '')
  }

  useEffect(handleRefine, [query])

  return null
}

export default VirtualSearchBox
