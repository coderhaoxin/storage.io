
import { random } from './util'
import Storage from './storage'

class Store {
  constructor(opts = {}) {
    this.name = (opts.name || random()) + '-store'
    this.type = opts.type === 'session' ? 'session' : 'local'
    this.storage = new Storage(this.type)

    let store = this.storage.get(this.name)
    if (typeof store !== 'object') {
      console.warn('reset storage key: %s', this.name)
      this.storage.set(this.name, {})
    }
  }

  set(key, value) {
    let store = this.storage.get(this.name)

    store[key] = value

    this.storage.set(this.name, store)
  }

  get(key) {
    let store = this.all()

    return store[key]
  }

  all() {
    return this.storage.get(this.name) || {}
  }

  keys() {
    return Object.keys(this.all())
  }

  entities() {
    let store = this.all()

    return Object.keys(store).map((key) => {
      return store[key]
    })
  }

  size() {
    return this.keys().length
  }

  remove(key) {
    let store = this.all()

    if (store.hasOwnProperty(key)) {
      let value = store[key]
      delete store[key]

      this.storage.set(this.name, store)

      return value
    }
  }

  clear() {
    this.storage.set(this.name, {})
  }

  destroy() {
    this.storage.remove(this.name)
  }
}

export default Store
