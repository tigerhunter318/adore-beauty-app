import compareVersions from 'compare-versions'

export const compareVersion = (v1, operator, v2) => {
  const val1 = v1 ? v1.toString() : '0'
  const val2 = v2 ? v2.toString() : '0'
  return compareVersions.compare(val1, val2, operator)
}
