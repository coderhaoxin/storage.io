'use strict'

function random() {
  return Date.now().toString().slice(4) +
    Math.random().toString().slice(2, 6)
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
  isFloat,
  random,
  isInt
}
