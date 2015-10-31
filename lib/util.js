
'use strict'

const ONE_SECOND = 1000
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

/**
 * @param {String|Number} expire
 * @return {Number|Boolean}
 *
 * Example
 *   30 (s)
 *   '1d'
 *   '1h'
 *   '1m'
 */

function getExpire(expire) {
  let duration

  if (typeof expire === 'number') {
    duration = expire * ONE_SECOND
  }

  if (typeof expire === 'string') {
    const num = parseFloat(expire)

    switch (expire[expire.length - 1]) {
      case 'd':
        duration = num * ONE_DAY
      case 'h':
        duration = num * ONE_HOUR
      case 'm':
        duration = num * ONE_MINUTE
      default: // second
        duration = num * ONE_SECOND
    }
  }

  return duration ? duration + Date.now() : false
}

function random() {
  return Date.now().toString(16).slice(4) +
    Math.random().toString(16).slice(2)
}

function isInt(v) {
  if (Number && Number.isInteger) {
    return Number.isInteger(v)
  }

  return parseInt(v) === v
}

function isFloat(v) {
  if (typeof v !== 'number') {
    return false
  }

  return !isInt(v)
}

function getStorage(type) {
  return type === 'local' ? localStorage : sessionStorage
}

/**
 * export
 */

export {
  getStorage,
  getExpire,
  isFloat,
  random,
  isInt
}
