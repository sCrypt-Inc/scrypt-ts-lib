import { method, assert, SmartContract } from 'scrypt-ts'
import { Fraction, FRMath } from '../../src/fractionMath'

export class FRMathTest extends SmartContract {
    @method()
    runOp(op: bigint, x: Fraction, y: Fraction): Fraction {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (op == 0n) {
            r = FRMath.add(x, y)
        } else if (op == 1n) {
            r = FRMath.sub(x, y)
        } else if (op == 2n) {
            r = FRMath.mul(x, y)
        } else if (op == 3n) {
            r = FRMath.div(x, y)
        } else if (op == 4n) {
            r = FRMath.abs(x)
        }
        return r
    }

    @method()
    runSafeOp(op: bigint, x: Fraction, y: Fraction): Fraction {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (op == 0n) {
            r = FRMath.sAdd(x, y)
        } else if (op == 1n) {
            r = FRMath.sSub(x, y)
        } else if (op == 2n) {
            r = FRMath.sMul(x, y)
        } else if (op == 3n) {
            r = FRMath.sDiv(x, y)
        } else if (op == 4n) {
            r = FRMath.sAbs(x)
        }
        return r
    }

    @method()
    public unlock(
        x: Fraction,
        y: Fraction,
        z: Fraction,
        op: bigint,
        strict: boolean
    ) {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (strict) {
            r = this.runSafeOp(op, x, y)
            assert(FRMath.sEqual(r, z))
        } else {
            r = this.runOp(op, x, y)
            assert(FRMath.equal(r, z))
        }
        assert(true)
    }

    @method()
    public unlockScaled(
        s: bigint,
        x: Fraction,
        y: Fraction,
        op: bigint,
        strict: boolean,
        sr: bigint
    ) {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (strict) {
            r = this.runSafeOp(op, x, y)
            assert(FRMath.scaleUp(r, s) == sr)
        } else {
            r = this.runOp(op, x, y)
            assert(FRMath.scaleUp(r, s) == sr)
        }
        assert(true)
    }
}
