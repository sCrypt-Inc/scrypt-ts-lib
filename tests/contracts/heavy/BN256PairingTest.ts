import {
    BN256Pairing,
    BN256,
    FQ2,
    FQ12,
    CurvePoint,
    TwistPoint,
    LineFuncRes,
} from '../../../src/ec/bn256'
import { method, assert, SmartContract } from 'scrypt-ts'

export class BN256PairingTest extends SmartContract {
    @method()
    public lineFuncAdd(
        r: TwistPoint,
        p: TwistPoint,
        q: CurvePoint,
        r2: FQ2,
        res: LineFuncRes
    ) {
        assert(
            BN256Pairing.compareLineFuncRes(
                BN256Pairing.modLineFuncRes(
                    BN256Pairing.lineFuncAdd(r, p, q, r2)
                ),
                BN256Pairing.modLineFuncRes(res)
            )
        )
    }

    @method()
    public lineFuncDouble(r: TwistPoint, q: CurvePoint, res: LineFuncRes) {
        assert(
            BN256Pairing.compareLineFuncRes(
                BN256Pairing.modLineFuncRes(BN256Pairing.lineFuncDouble(r, q)),
                BN256Pairing.modLineFuncRes(res)
            )
        )
    }

    @method()
    public mulLine(ret: FQ12, a: FQ2, b: FQ2, c: FQ2, res: FQ12) {
        assert(
            BN256.compareFQ12(
                BN256.modFQ12(BN256Pairing.mulLine(ret, a, b, c)),
                BN256.modFQ12(res)
            )
        )
    }

    @method()
    public miller(a: TwistPoint, b: CurvePoint, res: FQ12) {
        assert(BN256.compareFQ12(BN256Pairing.miller(a, b), res))
    }

    @method()
    public finalExp(a: FQ12, res: FQ12) {
        assert(BN256.compareFQ12(BN256Pairing.finalExponentiation(a), res))
    }

    @method()
    public pair(g1: CurvePoint, g2: TwistPoint, res: FQ12) {
        assert(BN256.compareFQ12(BN256Pairing._pair(g1, g2), res))
    }
}
