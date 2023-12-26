const fs = require('fs')

const argumentsObject = (() => {
  const args = {}
  process.argv.slice(2).forEach(element => {
    const matches = element.match('--([a-zA-Z0-9.]+)=(.*)')
    if (matches) {
      const key = matches[1]
      let val = matches[2].replace(/^['"]/, '').replace(/['"]$/, '')
      if (val.toLowerCase() === 'true') {
        val = true
      } else if (val.toLowerCase() === 'false') {
        val = false
      } else if (val.toLowerCase() === 'null') {
        val = null
      } else if (val.toLowerCase() === 'undefined') {
        val = undefined
      } else if (!Number.isNaN(Number(val))) {
        val = Number(val)
      }

      if (key.includes('.')) {
        const keys = key.split('.')
        const [parentKey, childKey] = keys
        if (!args[parentKey]) {
          args[parentKey] = {}
        }
        args[parentKey][childKey] = val
      } else {
        args[key] = val
      }
    }
  })
  return args
})()

/*
 *
 * $ node writeJson.js --file="../config.local.json" --fortId="test01" --isStagingApp=false --braintree.clientToken="a01" --test=null --test1=11 --test2=undefined
 * $ node writeJson.js --file="./config.local.json" --fortId="test01" --isStagingApp=false --braintree.clientToken="a01" --braintree.clientToken2="a02"
 */
const { file } = argumentsObject
if (file) {
  delete argumentsObject.file
  const jsonString = JSON.stringify(argumentsObject)

  fs.writeFileSync(file, jsonString)
  console.log(file, 'set to', jsonString) // eslint-disable-line no-console
} else {
  console.warn('error: file param not set.')
}
