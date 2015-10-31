
'use strict'

import { getExpire } from '../lib/util'
import { expect } from 'chai'

const ONE_SECOND = 1000
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

describe('## util', () => {
  describe('# getExpire', () => {
    const now = Date.now()

    const above = (expire) => {
      return getExpire(expire) - now >= 0
    }

    it('2 day', () => {
      expect(above('2d'), true)
    })

    it('48 hour', () => {
      expect(above('48h'), true)
    })

    it('2 minute', () => {
      expect(above('2m'), true)
    })

    it('2 second - 2s', () => {
      expect(above('2s'), true)
    })

    it('2 second - `2`', () => {
      expect(above('2'), true)
    })

    it('2 second - 2', () => {
      expect(above(2), true)
    })
  })
})

