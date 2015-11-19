
import { strictEqual as equal } from 'assert'
import { getExpire } from '../lib/util'

const ONE_SECOND = 1000
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR

describe('## util', () => {
  describe('# getExpire', () => {
    const check = (expire, duration) => {
      const now = Date.now()
      const valid = (getExpire(expire) - now >= duration) &&
       (getExpire(expire) - now < duration + ONE_SECOND)

      equal(valid, true)
    }

    it('2 day', () => {
      check('2d', 2 * ONE_DAY)
    })

    it('48 hour', () => {
      check('48h', 48 * ONE_HOUR)
    })

    it('2 minute', () => {
      check('2m', 2 * ONE_MINUTE)
    })

    it('2 second - 2s', () => {
      check('2s', 2 * ONE_SECOND)
    })

    it('2 second - `2`', () => {
      check('2', 2 * ONE_SECOND)
    })

    it('2 second - 2', () => {
      check(2, 2 * ONE_SECOND)
    })
  })
})
