import { expect } from 'chai'
import { ArrayUtilTest } from './contracts/arrayUtilTest'
import { ByteString } from 'scrypt-ts'

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
