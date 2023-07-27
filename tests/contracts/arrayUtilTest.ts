import { method, assert, SmartContract, ByteString } from 'scrypt-ts'
import { ArrayUtils } from '../../src/arrayUtils'

export class ArrayUtilTest extends SmartContract {
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
