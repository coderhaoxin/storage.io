
import { strictEqual as equal, deepEqual } from 'assert'
import { session, local, Queue, Store } from '../lib'
import { getStorage } from '../lib/util'

describe('## storage.io', () => {
  describe('# local storage', () => {
    it('set(), get(), patch(), remove(), clear()', () => {
      basic(local)
    })

    it('expire', (done) => {
      expire(local, done)
    })

    it('queue', () => {
      const opts = {
        name: 'local-queue',
        type: 'local'
      }

      testQueue(opts)
    })

    it('queue - limit', () => {
      const opts = {
        name: 'local-queue-limit',
        type: 'local',
        limit: 2
      }

      testQueueLimit(opts)
    })

    it('store', () => {
      const opts = {
        name: 'local-store',
        type: 'local'
      }

      testStore(opts)
    })
  })

  describe('# session storage', () => {
    it('set(), get(), patch(), remove(), clear()', () => {
      basic(session)
    })

    it('expire', (done) => {
      expire(session, done)
    })

    it('queue', () => {
      const opts = {
        name: 'session-queue',
        type: 'session'
      }

      testQueue(opts)
    })

    it('queue - limit', () => {
      const opts = {
        name: 'session-queue-limit',
        type: 'session',
        limit: 2
      }

      testQueueLimit(opts)
    })

    it('store', () => {
      const opts = {
        name: 'session-store',
        type: 'session'
      }

      testStore(opts)
    })
  })
})

function basic(storage) {
  storage.set('i', 123)
  storage.set('f', 12.3)
  storage.set('s', '123')
  storage.set('j', {
    name: 'test'
  })

  storage.patch('p', {a: 1})
  storage.patch('p', {b: 2})
  storage.patch('p', {a: 'a'})

  equal(storage.get('i'), 123)
  equal(storage.get('f'), 12.3)
  equal(storage.get('s'), '123')
  deepEqual(storage.get('j'), {
    name: 'test'
  })
  deepEqual(storage.get('p'), {
    a: 'a',
    b: 2
  })

  storage.remove('i')

  equal(storage.get('i'), undefined)
  equal(storage.get('f'), 12.3)

  storage.clear()

  equal(storage.get('i'), undefined)
  equal(storage.get('f'), undefined)
  equal(storage.get('s'), undefined)
  equal(storage.get('j'), undefined)
}

function expire(storage, done) {
  storage.set('e1', 1, '1s')
  storage.set('e2', 2, '1')
  storage.set('e3', 3, 1)
  storage.set('ne', 4)

  equal(storage.get('e1'), 1)
  equal(storage.get('e2'), 2)
  equal(storage.get('e3'), 3)
  equal(storage.get('ne'), 4)

  setTimeout(() => {
    equal(storage.get('e1'), 1)
    equal(storage.get('e2'), 2)
    equal(storage.get('e3'), 3)
    equal(storage.get('ne'), 4)

    setTimeout(() => {
      equal(storage.get('e1'), undefined)
      equal(storage.get('e2'), undefined)
      equal(storage.get('e3'), undefined)
      equal(storage.get('ne'), 4)
      done()
    }, 1000)
  }, 500)
}

function testQueue(opts) {
  const queue = new Queue(opts)

  queue.push(1)
  queue.push('a')
  queue.push({
    name: 'test'
  })

  equal(queue.size(), 3)
  equal(queue.shift(), 1)
  deepEqual(queue.pop(), {
    name: 'test'
  })

  equal(queue.size(), 1)

  queue.clear()

  equal(queue.size(), 0)

  testDestroy(opts.type, opts.name + '-queue', '[]')
  queue.destroy()
  testDestroy(opts.type, opts.name + '-queue', null)
}

function testQueueLimit(opts) {
  const queue = new Queue(opts)

  queue.push(1)
  equal(queue.size(), 1)
  deepEqual(queue.all(), [1])

  queue.push(2)
  equal(queue.size(), 2)
  deepEqual(queue.all(), [1, 2])

  queue.push(3)
  equal(queue.size(), 2)
  deepEqual(queue.all(), [2, 3])

  queue.push(4)
  equal(queue.size(), 2)
  deepEqual(queue.all(), [3, 4])
}

function testStore(opts) {
  const store = new Store(opts)

  store.set('a', 1)
  store.set('b', 's')
  store.set('c', {
    name: 'test'
  })

  equal(store.get('a'), 1)
  equal(store.get('b'), 's')
  deepEqual(store.get('c'), {
    name: 'test'
  })

  store.set('a', 2)
  equal(store.get('a'), 2)

  deepEqual(store.keys().sort(), ['a', 'b', 'c'])
  deepEqual(store.all(), {
    a: 2,
    b: 's',
    c: {
      name: 'test'
    }
  })
  deepEqual(store.entities(), [
    2, 's', { name: 'test' }
  ])

  equal(store.size(), 3)

  equal(store.remove('a'), 2)
  equal(store.size(), 2)

  store.clear()
  equal(store.size(), 0)

  testDestroy(opts.type, opts.name + '-store', '{}')
  store.destroy()
  testDestroy(opts.type, opts.name + '-store', null)
}

function testDestroy(type, name, value) {
  equal(getStorage(type).getItem(name), value)
}
