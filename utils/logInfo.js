import { isDev } from './dev'

export const logInfoColors = {
  purple: '#8b8bf8',
  lightgreen: '#9cf17e',
  green: '#39961BFF',
  yellow: '#FFD500FF',
  lightblue: '#5bb9fc',
  blue: '#0b66e3',
  pink: '#FC3F99FF',
  red: '#ff1641'
}

const logInfo = (color = 'green', text, ...rest) => {
  const style = typeof color === 'string' ? { color } : color
  const fontWeight = style.fontWeight ?? 'bold'
  let textColor = logInfoColors.blue
  if (style.color) {
    textColor = logInfoColors[style.color] ?? style.color
  }
  if (isDev()) {
    console.info(`%c${text}`, `font-weight:${fontWeight};color:${textColor}`, ...rest)
  }
}

export const logObjectToJson = obj => {
  console.log(JSON.stringify(obj)) //eslint-disable-line
}
export default logInfo
