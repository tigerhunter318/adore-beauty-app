const { Buffer } = require('buffer')

export const toBase64 = text => Buffer.from(text).toString('base64')
