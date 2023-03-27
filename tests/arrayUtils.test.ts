import { expect } from 'chai'
import { ArrayUtils } from '../src/arrayUtils'
import { method, assert, SmartContract, ByteString } from 'scrypt-ts'

class ArrayUtilTest extends SmartContract {
    @method()
    public testGetElem(b: ByteString, idx: bigint, res: ByteString) {
        const test = ArrayUtils.getElemAt(b, idx)
        assert(
            ArrayUtils.getElemAt(b, idx) == res,
            'Retrieved elem does not match passed result.'
        )
    }

    @method()
    public testSetElem(
        b: ByteString,
        idx: bigint,
        val: ByteString,
        res: ByteString
    ) {
        assert(
            ArrayUtils.setElemAt(b, idx, val) == res,
            'Updated array does not match passed result.'
        )
    }
}

describe('Test ArrayUtils', () => {
    let arrayUtilTest: ArrayUtilTest

    before(async () => {
        await ArrayUtilTest.compile()
        arrayUtilTest = new ArrayUtilTest()
    })

    it('should pass getElemAt', () => {
        const b: ByteString = '00112233ccff'

        let result = arrayUtilTest.verify((self) => {
            self.testGetElem(b, 3n, '33')
        })
        expect(result.success, result.error).to.be.true

        result = arrayUtilTest.verify((self) => {
            self.testGetElem(b, 0n, '00')
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass setElemAt', () => {
        const b: ByteString = '00112233ccff'
        const res: ByteString = '0011ff33ccff'

        const result = arrayUtilTest.verify((self) => {
            self.testSetElem(b, 2n, 'ff', res)
        })
        expect(result.success, result.error).to.be.true
    })
})
