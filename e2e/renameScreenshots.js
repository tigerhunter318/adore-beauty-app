const fs = require('fs')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

/* eslint-disable no-console */

const argv = (() => {
  const args = {}
  process.argv.slice(2).forEach(element => {
    const matches = element.match('--([a-zA-Z0-9]+)=(.*)')
    if (matches) {
      args[matches[1]] = matches[2].replace(/^['"]/, '').replace(/['"]$/, '')
    }
  })
  return args
})()

const { folder } = argv

/*
 * rename detox screenshots folders to flat-list of pngs
 * $ node e2e/renameScreenshots.js --folder='./artifacts'
 */
const fileList = []
const folderList = {}

const renameFilesRecursive = (dir, extension = '.png') => {
  fs.readdirSync(dir).forEach(file => {
    const itsDir = path.basename(dir)
    const itsPath = path.resolve(dir, file)
    const itsStat = fs.statSync(itsPath)

    if (itsPath.search(extension) > -1) {
      const newName = `${itsDir}--${file}`.replace(/ /g, '-')
      if (itsDir.indexOf('✗') === 0) folderList[itsDir] = itsDir
      fileList.push({
        oldSrc: path.join(dir, file),
        newSrc: path.join(folder, newName)
      })
    }

    if (itsStat.isDirectory()) {
      renameFilesRecursive(itsPath, extension)
    }
  })
}

renameFilesRecursive(folder)

fileList.forEach(f => {
  console.log('--moved file', f.newSrc) // eslint-disable-line no-console
  fs.renameSync(f.oldSrc, f.newSrc)
})

async function addTestResults() {
  try {
    const failedTests = Object.values(folderList).join('\n')
    // const { stdout: result } = await exec(`echo '${failedTests}'`);
    const { stdout: result } = await exec(`envman add --key DETOX_TEST_RESULTS --value '${failedTests}'`)
    console.log('exec: ', result)
  } catch (error) {
    console.warn('exec error ', error)
  }
}

addTestResults()
