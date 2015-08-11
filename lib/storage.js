'use strict'

import { getStorage, random, isFloat, isInt } from './util'

const typeSuffix = '_type_' + random()
const stringify = JSON.stringify
const parse = JSON.parse

class Storage {
  constructor(type) {
    const storage = getStorage(type)

    this.type = type
    this.setItem = storage.setItem.bind(storage)
    this.getItem = storage.getItem.bind(storage)
    this.removeItem = storage.removeItem.bind(storage)
  }

  set(key, value) {
    let type = getType(value)

    if (type === 'object') {
      this.setItem(key, stringify(value))
    } else {
      this.setItem(key, value)
    }

    this.setItem(key + typeSuffix, type)
  }

  get(key) {
    let type = this.getItem(key + typeSuffix)
    let value = this.getItem(key)

    if (!type || !value) {
      return
    }

    if (type === 'int') {
      return parseInt(value)
    }

    if (type === 'float') {
      return parseFloat(value)
    }

    if (type === 'undefined') {
      return
    }

    if (type === 'object') {
      return parse(value)
    }

    return value
  }

  remove(key) {
    this.removeItem(key)
    this.removeItem(key + typeSuffix)
  }

  clear() {
    return getStorage(this.type).clear()
  }
}

function getType(value) {
  if (isInt(value)) {
    return 'int'
  }

  if (isFloat(value)) {
    return 'float'
  }

  return typeof value
}

/**
 * export
 */

export default Storage
