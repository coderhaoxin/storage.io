
import { random } from './util'
import Storage from './storage'

class Queue {
  constructor(opts = {}) {
    this.name = (opts.name || random()) + '-queue'
    this.limit = opts.limit
    this.type = opts.type === 'session' ? 'session' : 'local'
    this.storage = new Storage(this.type)

    let queue = this.storage.get(this.name)
    if (!Array.isArray(queue)) {
      console.warn('reset storage key: %s', this.name)
      this.storage.set(this.name, [])
    }
  }

  push(value) {
    let q = this.storage.get(this.name)
    let len = q.push(value)

    if (this.limit && len > this.limit) {
      q.shift()
    }

    this.storage.set(this.name, q)

    return len
  }

  shift() {
    let q = this.storage.get(this.name)
    let v = q.shift()

    this.storage.set(this.name, q)

    return v
  }

  pop() {
    let q = this.storage.get(this.name)
    let v = q.pop()

    this.storage.set(this.name, q)

    return v
  }

  size() {
    return this.storage.get(this.name).length
  }

  clear() {
    this.storage.set(this.name, [])
  }

  all() {
    return this.storage.get(this.name)
  }

  destroy() {
    this.storage.remove(this.name)
  }
}

/**
 * export
 */

export default Queue
