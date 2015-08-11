'use strict'

import { session, local, Queue, Store } from '../'
import { expect } from 'chai'

describe('## storage.io', function() {
  describe('# local storage', function() {
    it('set(), get(), remove(), clear()', function() {
      basic(local)
    })

    it('queue', function() {
      const queue = new Queue({
        name: 'local-queue',
        type: 'local'
      })

      testQueue(queue)
    })

    it('store', function() {
      const store = new Store({
        name: 'local-store',
        type: 'local'
      })

      testStore(store)
    })
  })

  describe('# session storage', function() {
    it('set(), get(), remove(), clear()', function() {
      basic(session)
    })

    it('queue', function() {
      const queue = new Queue({
        name: 'session-queue',
        type: 'session'
      })

      testQueue(queue)
    })

    it('store', function() {
      const store = new Store({
        name: 'session-store',
        type: 'session'
      })

      testStore(store)
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

function testQueue(queue) {
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
}

function testStore(store) {
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

  store.clear()
  expect(store.size()).to.equal(0)
}
