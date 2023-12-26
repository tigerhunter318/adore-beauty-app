import { isValidObject } from '../../../utils/validation'
import { trimHtmlSpaces } from '../../../utils/format'

export const findNestedNodeByPropertyValue = (node, property, targetValue) => {
  delete node?.parent
  delete node?.prev
  delete node?.next

  let result = null

  if (isValidObject(node)) {
    if (node[property] === targetValue) return node

    Object.entries(node).find(([key, value]) => (result = findNestedNodeByPropertyValue(value, property, targetValue))) // eslint-disable-line
  }

  return result
}

export const findNestedNodeByPropertyKey = (node, targetKey, isLink = false) => {
  if (!isLink) {
    delete node?.parent
    delete node?.prev
    delete node?.next
  }

  let result = null

  if (isValidObject(node)) {
    if (Object.prototype.hasOwnProperty.call(node, targetKey)) return node[targetKey]

    Object.entries(node).find(([key, value]) => (result = findNestedNodeByPropertyKey(value, targetKey)))?.[1] // eslint-disable-line
  }

  return result
}

export const findNodeLinkDetails = node => {
  if (!isValidObject(node)) return null

  const linkNode = node?.name === 'a' ? node : findNestedNodeByPropertyValue(node, 'name', 'a')
  const linkUrl = linkNode?.attribs?.href
  const nestedLinkTitle = findNestedNodeByPropertyKey(linkNode, 'data', true)
  const linkTitle = trimHtmlSpaces(linkNode?.attribs?.title || nestedLinkTitle)
  const hasLink = !!linkUrl && !!linkTitle

  return { linkUrl, linkTitle, hasLink }
}
