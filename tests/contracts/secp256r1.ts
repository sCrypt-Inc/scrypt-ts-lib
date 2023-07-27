import { SECP256R1 } from '../../src/ec/secp256r1'
import { Point, Signature } from '../../src/ec/misc'
import { method, assert, SmartContract } from 'scrypt-ts'

export class SECP256R1Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(SECP256R1.modReduce(x, m) == res)
    }

    @method()
    public modInverseBranchlessP(x: bigint, res: bigint) {
        assert(SECP256R1.modInverseBranchlessP(x) == res)
    }

    @method()
    public modInverseBranchlessN(x: bigint, res: bigint) {
        assert(SECP256R1.modInverseBranchlessN(x) == res)
    }

    @method()
    public addPoints(a: Point, b: Point, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.addPoints(a, b), res))
    }

    @method()
    public doublePoint(a: Point, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.doublePoint(a), res))
    }

    @method()
    public mulByScalar(a: Point, scalar: bigint, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.mulByScalar(a, scalar), res))
    }

    @method()
    public mulGeneratorByScalar(scalar: bigint, res: Point) {
        assert(
            SECP256R1.comparePoints(SECP256R1.mulGeneratorByScalar(scalar), res)
        )
    }

    @method()
    public verifySig(
        data: bigint,
        sig: Signature,
        pubKey: Point,
        res: boolean
    ) {
        assert(SECP256R1.verifySig(data, sig, pubKey) == res)
    }
}
