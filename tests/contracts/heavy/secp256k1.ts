import { method, assert, SmartContract } from 'scrypt-ts'
import { SECP256K1 } from '../../../src/ec/secp256k1'
import { Point, Signature } from '../../../src/ec/misc'

export class SECP256K1Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(SECP256K1.modReduce(x, m) == res)
    }

    @method()
    public addPoints(a: Point, b: Point, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.addPoints(a, b), res))
    }

    @method()
    public doublePoint(a: Point, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.doublePoint(a), res))
    }

    @method()
    public mulByScalar(a: Point, scalar: bigint, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.mulByScalar(a, scalar), res))
    }

    @method()
    public verifySig(
        hashInt: bigint,
        sig: Signature,
        pubKey: Point,
        res: boolean
    ) {
        assert(SECP256K1.verifySig(hashInt, sig, pubKey) == res)
    }
}
