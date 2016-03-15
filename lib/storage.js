
import { getStorage, getExpire, isFloat, isInt } from './util'

const stringify = JSON.stringify
const expireSuffix = '__expire'
const typeSuffix = '__type'

const parse = JSON.parse

class Storage {
  constructor(type) {
    const storage = getStorage(type)

    this.type = type
    this.setItem = storage.setItem.bind(storage)
    this.getItem = storage.getItem.bind(storage)
    this.removeItem = storage.removeItem.bind(storage)
  }

  set(key, value, expire) {
    const type = getType(value)
    expire = getExpire(expire)

    if (type === 'object') {
      this.setItem(key, stringify(value))
    } else {
      this.setItem(key, value)
    }

    this.setItem(key + typeSuffix, type)
    if (expire) {
      this.setItem(key + expireSuffix, expire)
    }
  }

  get(key) {
    const expire = this.getItem(key + expireSuffix)
    const type = this.getItem(key + typeSuffix)

    let value = this.getItem(key)

    if (expire && parseInt(expire) < Date.now()) {
      // clear item
      this.remove(key)
      return
    }

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
    this.removeItem(key + expireSuffix)
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
