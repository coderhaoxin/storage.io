'use strict'

import Storage from './storage'
import Queue from './queue'

/**
 * export
 */

const session = new Storage('session')
const local = new Storage('local')

export {
  session,
  local,
  Queue
}