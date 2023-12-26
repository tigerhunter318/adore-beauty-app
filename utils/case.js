export const toCamelCase = str => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
export const capitalize = str => str.replace(/(_|-)/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())

export const toPascalCase = string =>
  string
    .match(/[a-z]+/gi)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('')

export const capitalizeFirstWord = word =>
  word && (word.charAt(0) ? word.charAt(0).toUpperCase() : word.charAt(1).toUpperCase()) + word.slice(1)?.toLowerCase()
