import React from 'react'
import Type from '../ui/Type'
import Container from '../ui/Container'
import { isValidArray } from '../../utils/validation'

const SubCategoryList = ({ item, onPress }: { item: {} | any; onPress: (subItem: {}) => void }) => {
  const { name, children: subItems } = item || {}

  return (
    <Container mb={1.5} mr={1} testID="SubCategoryList">
      <Type onPress={() => onPress(item)} bold mb={1.5} size={14}>
        {name}
      </Type>
      {isValidArray(subItems) &&
        subItems.map((subItem: { id: any; name: any }, index: any) => (
          <Type
            key={`SubCategoryListItem-${subItem.id}-${index}`}
            mb={1.5}
            onPress={() => onPress(subItem)}
            size={13}
            testID="SubCategoryList.Item"
          >
            {subItem.name}
          </Type>
        ))}
    </Container>
  )
}

export default SubCategoryList
