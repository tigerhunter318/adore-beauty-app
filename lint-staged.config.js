// https://github.com/okonet/lint-staged/issues/825#issuecomment-893759012
const tsconfig = require('./tsconfig.json')

const getTscFlags = () => {
  const { compilerOptions } = tsconfig
  return Object.keys(compilerOptions)
    .flatMap(key => {
      const value = compilerOptions[key]
      if (Array.isArray(value)) {
        return `${key} ${value.join(',')}`
      }
      return `${key} ${value}`
    })
    .map(key => `--${key}`)
    .join(' ')
}

module.exports = {
  '*.{js,jsx}': [
    //
    'eslint --fix',
    'git add',
    'jest -u --bail --findRelatedTests'
  ],
  '*.{ts,tsx}': [
    //
    `tsc ${getTscFlags()}`,
    'eslint --fix',
    'git add',
    'jest -u --bail --findRelatedTests'
  ]
}
