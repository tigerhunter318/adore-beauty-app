import React from 'react'
import { ScrollView, View } from 'react-native'
import { isValidArray } from '../../utils/validation'

type ItemColumnsProps = {
  items: any
  numOfColumns?: number
  contentContainerStyle?: {}
  columnProps?: {}
  renderItem: (category: {}, index: number) => void
  testID: any
}

const ItemColumns = ({
  items,
  numOfColumns = 2,
  contentContainerStyle = {},
  columnProps = {},
  renderItem,
  testID
}: ItemColumnsProps) => {
  const width = `${100 / numOfColumns}%`
  const cols = []
  for (let i = 0; i < numOfColumns; i += 1) {
    cols.push(i)
  }

  if (!isValidArray(cols) || !isValidArray(items)) return null

  return (
    <ScrollView testID={testID} contentContainerStyle={[contentContainerStyle, { flexDirection: 'row' }]}>
      {cols.map(ci => (
        <View style={{ width }} {...columnProps} key={`col-${ci}`}>
          {items.map((item: {}, i: number) => i % numOfColumns === ci && renderItem(item, i))}
        </View>
      ))}
    </ScrollView>
  )
}

export default ItemColumns
