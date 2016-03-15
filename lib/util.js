
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

export function getExpire(expire) {
  let duration

  if (typeof expire === 'number') {
    duration = expire * ONE_SECOND
  }

  if (typeof expire === 'string') {
    const num = parseFloat(expire)

    switch (expire[expire.length - 1]) {
      case 'd':
        duration = num * ONE_DAY
        break
      case 'h':
        duration = num * ONE_HOUR
        break
      case 'm':
        duration = num * ONE_MINUTE
        break
      default: // second
        duration = num * ONE_SECOND
    }
  }

  return duration ? duration + Date.now() : false
}

export function random() {
  return Date.now().toString(16).slice(4) +
    Math.random().toString(16).slice(2)
}

export function isInt(v) {
  if (Number && Number.isInteger) {
    return Number.isInteger(v)
  }

  return parseInt(v) === v
}

export function isFloat(v) {
  if (typeof v !== 'number') {
    return false
  }

  return !isInt(v)
}

export function getStorage(type) {
  return type === 'local' ? localStorage : sessionStorage
}
