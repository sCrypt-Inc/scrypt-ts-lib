import { assert, ByteString, method, PubKey, SmartContract } from 'scrypt-ts'

import { Point } from '../../src/ec/misc'
import { Schnorr } from '../../src/schnorr'

export class SchnorrTest extends SmartContract {
    @method()
    public test(
        sig: ByteString,
        pubKey: PubKey,
        msg: ByteString,
        R: Point,
        res: boolean
    ) {
        assert(Schnorr.verify(sig, pubKey, msg, R) == res)
    }
}
