import { expect } from 'chai'
import { Shift10 } from '../src/shift10'
import { method, assert, SmartContract } from 'scrypt-ts'

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

describe('Test Shift10', () => {
    let shift10test = undefined

    before(async () => {
        await Shift10Test.compile()
        shift10test = new Shift10Test()
    })

    it('should pass pow', () => {
        const result = shift10test.verify((self) => {
            self.unlock(10n, 14n, OPS.pow, 10n ** 14n)
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
        const result = shift10test.verify((self) => {
            self.unlock(11189196n, 8n, OPS.left, 11189196n * 10n ** 8n)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass shift right', () => {
        const result = shift10test.verify((self) => {
            self.unlock(11189196n, 8n, OPS.right, 11189196n / 10n ** 8n)
        })
        expect(result.success, result.error).to.be.true
    })
})
