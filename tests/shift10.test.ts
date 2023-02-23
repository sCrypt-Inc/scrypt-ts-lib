import { expect } from 'chai'
import { Shift10 } from '../src/shift10'
import { method, assert, SmartContract } from 'scrypt-ts'
import bigintRnd from 'bigint-rnd'
const OPS = {
    pow: 0n,
    left: 1n,
    right: 2n,
}

class Shift10Test extends SmartContract {
    @method()
    public unlock(x: bigint, n: bigint, op: bigint, expected: bigint) {
        let result = 0n
        if (op == 0n) {
            result = Shift10.pow(n)
        } else if (op == 1n) {
            result = Shift10.left(x, n)
        } else if (op == 2n) {
            result = Shift10.right(x, n)
        }

        assert(result == expected)
    }
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
