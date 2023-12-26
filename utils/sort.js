/**
 * [{key:1,name:'one'},{key:0,name:'zero'}].sort(compareNumber('key'))
 *
 * @param property
 * @returns {function(*, *): number}
 */
export const compareAlpha = property => (a, b) => (a[property] === b[property] ? 0 : a[property] < b[property] ? -1 : 1) // eslint-disable-line no-nested-ternary

// [{key:'2020-01-01 16:01',name:'one'},{{key:'2020-01-01 16:00',name:'zero'}].sort(compareNumber('key'))
export const compareDate = (property, order = 'desc') => (a, b) => {
  if (order === 'desc') {
    return Number(new Date(b[property]) - Number(new Date(a[property])))
  }
  return Number(new Date(a[property]) - Number(new Date(b[property])))
}

export const compareNumber = property => (a, b) => Number(a[property]) - Number(b[property])
