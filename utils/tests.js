import { shallowEqual } from 'fast-equals'
/* eslint-disable no-console */

const logFail = (...params) => {
  const color = 'rgb(200, 0, 0)'
  const styles = `color: white; font-size: 12px;background-color:${color};`
  console.log('%cfail', styles, params)
}
const logPass = (...params) => {
  const color = 'rgb(87,210,115)'
  const styles = `color: white; font-size: 12px;background-color:${color};`
  console.log('%cpass', styles, params)
}

const logTest = (text, color = 'rgb(103,161,248)') => {
  const styles = `color: white; font-size: 12px;background-color:${color};`
  console.log('%c%s', styles, text)
}

export const test = async (name, assertions) => {
  logTest(`start test: ${name}`, 'rgb(250,158,63)')
  const response = await assertions()
  logTest(`complete test: ${name}`, 'rgb(0, 170, 0)')
  return response
}

export const expect = source => {
  const toEqual = target => {
    if (shallowEqual(source, target)) {
      logPass('toEqual', source, target)
    } else {
      logFail('toEqual', source, target)
      throw new Error('toEqual fail')
    }
  }

  const toBe = target => {
    if (source !== target) {
      logFail('toBe', source, target)
      throw new Error('toBe fail')
    } else {
      logPass('toBe', source, target)
    }
  }

  return {
    toEqual,
    toBe
  }
}
