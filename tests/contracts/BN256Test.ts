import {
    BN256,
    FQ2,
    FQ6,
    FQ12,
    CurvePoint,
    TwistPoint,
} from '../../src/ec/bn256'
import { method, assert, SmartContract } from 'scrypt-ts'

export class BN256Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(BN256.modReduce(x, m) == res)
    }

    @method()
    public mulFQ2(a: FQ2, b: FQ2, res: FQ2) {
        assert(BN256.compareFQ2(BN256.mulFQ2(a, b), res))
    }

    @method()
    public squareFQ2(a: FQ2, res: FQ2) {
        assert(BN256.compareFQ2(BN256.squareFQ2(a), res))
    }

    @method()
    public invFQ2(a: FQ2, res: FQ2) {
        assert(BN256.compareFQ2(BN256.inverseFQ2(a), res))
    }

    @method()
    public mulFQ6(a: FQ6, b: FQ6, res: FQ6) {
        assert(BN256.compareFQ6(BN256.mulFQ6(a, b), res))
    }

    @method()
    public squareFQ6(a: FQ6, res: FQ6) {
        assert(BN256.compareFQ6(BN256.squareFQ6(a), res))
    }

    @method()
    public invFQ6(a: FQ6, res: FQ6) {
        assert(BN256.compareFQ6(BN256.inverseFQ6(a), res))
    }

    @method()
    public squareFQ12(a: FQ12, res: FQ12) {
        assert(
            BN256.compareFQ12(
                BN256.modFQ12(BN256.squareFQ12(a)),
                BN256.modFQ12(res)
            )
        )
    }

    @method()
    public invFQ12(a: FQ12, res: FQ12) {
        assert(BN256.compareFQ12(BN256.inverseFQ12(a), res))
    }

    @method()
    public expFQ12(a: FQ12, power: bigint, res: FQ12) {
        assert(
            BN256.compareFQ12(
                BN256.modFQ12(BN256.expFQ12(a, power)),
                BN256.modFQ12(res)
            )
        )
    }

    @method()
    public expFQ12_u(a: FQ12, res: FQ12) {
        assert(BN256.compareFQ12(BN256.expFQ12_u(a), res))
    }

    @method()
    public frobeniusFQ12(a: FQ12, res: FQ12) {
        assert(BN256.compareFQ12(BN256.frobeniusFQ12(a), res))
    }

    @method()
    public frobeniusP2FQ12(a: FQ12, res: FQ12) {
        assert(BN256.compareFQ12(BN256.frobeniusP2FQ12(a), res))
    }

    @method()
    public mulFQ12(a: FQ12, b: FQ12, res: FQ12) {
        assert(
            BN256.compareFQ12(
                BN256.modFQ12(BN256.mulFQ12(a, b)),
                BN256.modFQ12(res)
            )
        )
    }

    @method()
    public doubleCurvePoint(a: CurvePoint, res: CurvePoint) {
        assert(
            BN256.compareCurvePoints(
                BN256.modCurvePoint(BN256.doubleCurvePoint(a)),
                BN256.modCurvePoint(res)
            )
        )
    }

    @method()
    public addCurvePoints(a: CurvePoint, b: CurvePoint, res: CurvePoint) {
        assert(
            BN256.compareCurvePoints(
                BN256.modCurvePoint(BN256.addCurvePoints(a, b)),
                BN256.modCurvePoint(res)
            )
        )
    }

    @method()
    public makeAffineCurvePoint(a: CurvePoint, res: CurvePoint) {
        assert(BN256.compareCurvePoints(BN256.makeAffineCurvePoint(a), res))
    }

    @method()
    public mulCurvePoint(a: CurvePoint, scalar: bigint, res: CurvePoint) {
        assert(
            BN256.compareCurvePoints(
                BN256.modCurvePoint(BN256.mulCurvePoint(a, scalar)),
                BN256.modCurvePoint(res)
            )
        )
    }

    @method()
    public doubleTwistPoint(a: TwistPoint, res: TwistPoint) {
        assert(BN256.compareTwistPoints(BN256.doubleTwistPoint(a), res))
    }

    @method()
    public addTwistPoints(a: TwistPoint, b: TwistPoint, res: TwistPoint) {
        assert(BN256.compareTwistPoints(BN256.addTwistPoints(a, b), res))
    }

    @method()
    public makeAffineTwistPoint(a: TwistPoint, res: TwistPoint) {
        assert(BN256.compareTwistPoints(BN256.makeAffineTwistPoint(a), res))
    }
}
