
<!-- [![Build status][travis-img]][travis-url] -->
<!-- [![Test coverage][coveralls-img]][coveralls-url] -->
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### storage.io

### Example

```js
import {
  session, // sessionStorage
  local    // localStorage
} from 'storage.io'

locat.set('i', 123)
locat.set('f', 12.3)
locat.set('s', '123')
locat.set('j', {
  name: 'test'
})

locat.remove('i')

locat.clear()
```

* basic queue

```js
import { Queue } from 'storage.io'

const queue = new Queue({
  name: 'local-queue',
  limit: 100,
  type: 'local'
})

queue.push(1)
queue.push('a')
queue.push({
  name: 'test'
})

queue.shift()
queue.pop()

queue.size()

queue.clear()
```

* basic store

```js
import { Store } from 'storage.io'

const store = new Store({
  name: 'local-store',
  type: 'local'
})

store.set('a', 1)
store.set('b', 's')
store.set('c', {
  name: 'test'
})

store.get('a')

store.entities()
store.keys()
store.all()

store.clear()
store.size()
```

### License
MIT

[npm-img]: https://img.shields.io/npm/v/storage.io.svg?style=flat-square
[npm-url]: https://npmjs.org/package/storage.io
[travis-img]: https://img.shields.io/travis/onebook/storage.io.svg?style=flat-square
[travis-url]: https://travis-ci.org/onebook/storage.io
[coveralls-img]: https://img.shields.io/coveralls/onebook/storage.io.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/onebook/storage.io?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/onebook/storage.io.svg?style=flat-square
[david-url]: https://david-dm.org/onebook/storage.io
