
'use strict'

import { session, local, Queue, Store } from '../lib'
import { getStorage } from '../lib/util'
import { expect } from 'chai'

describe('## storage.io', () => {
  describe('# local storage', () => {
    it('set(), get(), remove(), clear()', () => {
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
    it('set(), get(), remove(), clear()', () => {
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

  expect(storage.get('i')).to.equal(123)
  expect(storage.get('f')).to.equal(12.3)
  expect(storage.get('s')).to.equal('123')
  expect(storage.get('j')).to.deep.equal({
    name: 'test'
  })

  storage.remove('i')

  expect(storage.get('i')).to.equal(undefined)
  expect(storage.get('f')).to.equal(12.3)

  storage.clear()

  expect(storage.get('i')).to.equal(undefined)
  expect(storage.get('f')).to.equal(undefined)
  expect(storage.get('s')).to.equal(undefined)
  expect(storage.get('j')).to.equal(undefined)
}

function expire(storage, done) {
  storage.set('e1', 1, '1s')
  storage.set('e2', 2, '1')
  storage.set('e3', 3, 1)

  expect(storage.get('e1'), 1)
  expect(storage.get('e2'), 2)
  expect(storage.get('e3'), 3)

  setTimeout(() => {
    expect(storage.get('e1'), undefined)
    expect(storage.get('e2'), undefined)
    expect(storage.get('e3'), undefined)
    done()
  }, 1500)
}

function testQueue(opts) {
  const queue = new Queue(opts)

  queue.push(1)
  queue.push('a')
  queue.push({
    name: 'test'
  })

  expect(queue.size()).to.equal(3)
  expect(queue.shift()).to.equal(1)
  expect(queue.pop()).to.deep.equal({
    name: 'test'
  })

  expect(queue.size()).to.equal(1)

  queue.clear()

  expect(queue.size()).to.equal(0)

  testDestroy(opts.type, opts.name + '-queue', '[]')
  queue.destroy()
  testDestroy(opts.type, opts.name + '-queue', null)
}

function testQueueLimit(opts) {
  const queue = new Queue(opts)

  queue.push(1)
  expect(queue.size()).to.equal(1)
  expect(queue.all()).to.deep.equal([1])

  queue.push(2)
  expect(queue.size()).to.equal(2)
  expect(queue.all()).to.deep.equal([1, 2])

  queue.push(3)
  expect(queue.size()).to.equal(2)
  expect(queue.all()).to.deep.equal([2, 3])

  queue.push(4)
  expect(queue.size()).to.equal(2)
  expect(queue.all()).to.deep.equal([3, 4])
}

function testStore(opts) {
  const store = new Store(opts)

  store.set('a', 1)
  store.set('b', 's')
  store.set('c', {
    name: 'test'
  })

  expect(store.get('a')).to.equal(1)
  expect(store.get('b')).to.equal('s')
  expect(store.get('c')).to.deep.equal({
    name: 'test'
  })

  store.set('a', 2)
  expect(store.get('a')).to.equal(2)

  expect(store.keys().sort()).to.deep.equal(['a', 'b', 'c'])
  expect(store.all()).to.deep.equal({
    a: 2,
    b: 's',
    c: {
      name: 'test'
    }
  })
  expect(store.entities()).to.deep.equal([
    2, 's', { name: 'test' }
  ])

  expect(store.size()).to.equal(3)

  expect(store.remove('a')).to.equal(2)
  expect(store.size()).to.equal(2)

  store.clear()
  expect(store.size()).to.equal(0)

  testDestroy(opts.type, opts.name + '-store', '{}')
  store.destroy()
  testDestroy(opts.type, opts.name + '-store', null)
}

function testDestroy(type, name, value) {
  expect(getStorage(type).getItem(name)).to.equal(value)
}
