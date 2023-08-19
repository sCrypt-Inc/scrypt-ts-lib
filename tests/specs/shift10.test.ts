import { expect } from 'chai'
import bigintRnd from 'bigint-rnd'

import { Shift10Test } from '../contracts/shift10Test'
const OPS = {
    pow: 0n,
    left: 1n,
    right: 2n,
}

function randInt(min, max) {
    return bigintRnd(min, max)
}

describe('Test Shift10', () => {
    let shift10test = undefined

    before(async () => {
        await Shift10Test.compile()
        shift10test = new Shift10Test()
    })

    it('should pass pow', () => {
        const exp = randInt(1, 99)
        const result = shift10test.verify((self) => {
            self.unlock(10n, BigInt(exp), OPS.pow, 10n ** BigInt(exp))
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass pow 0', () => {
        const result = shift10test.verify((self) => {
            self.unlock(10n, 0n, OPS.pow, 1n)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should fail on negative integers pow', () => {
        expect(() => {
            shift10test.verify((self) => {
                self.unlock(0n, -3n, OPS.pow, -1n)
            })
        }).to.throw(/.*/)
    })

    it('should pass shift left', () => {
        const x = BigInt(randInt(1, 1000000000))
        const shift = BigInt(randInt(1, 10))
        const result = shift10test.verify((self) => {
            self.unlock(x, shift, OPS.left, x * 10n ** shift)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass shift right', () => {
        const x = BigInt(randInt(1, 1000000000))
        const shift = BigInt(randInt(1, 10))
        const result = shift10test.verify((self) => {
            self.unlock(x, shift, OPS.right, x / 10n ** shift)
        })
        expect(result.success, result.error).to.be.true
    })
})
