import { expect } from 'chai'
import { BN256 } from '../src/ec/bn256'
import { method, assert, SmartContract } from 'scrypt-ts'

class BN256Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(BN256.modReduce(x, m) === res)
    }
}

describe('Test BN256 curve', () => {
    let bn256test = undefined

    before(async () => {
        await BN256Test.compile()
        bn256test = new BN256Test()
    })

    it('should pass modReduce positive', () => {
        const result = bn256test.verify((self) => {
            self.modReduce(372193n, 3462n, 1759n)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass modReduce negative', () => {
        const result = bn256test.verify((self) => {
            self.modReduce(-3128731n, 324n, 137n)
        })
        expect(result.success, result.error).to.be.true
    })
})
