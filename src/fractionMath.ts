import { method, SmartContractLib, assert, abs } from 'scrypt-ts'

export type Fraction = {
    n: bigint // Numerator
    d: bigint // Denominator
}

// A fraction-based math library for high precision calculations.
export class FRMath extends SmartContractLib {
    @method()
    static add(x: Fraction, y: Fraction): Fraction {
        return {
            n: x.n * y.d + y.n * x.d,
            d: x.d * y.d,
        }
    }

    // Safe addition. Requires both argument denominators > 0.
    @method()
    static sAdd(x: Fraction, y: Fraction): Fraction {
        assert(x.d > 0n && y.d > 0n)
        return {
            n: x.n * y.d + y.n * x.d,
            d: x.d * y.d,
        }
    }

    @method()
    static sub(x: Fraction, y: Fraction): Fraction {
        return {
            n: x.n * y.d - y.n * x.d,
            d: x.d * y.d,
        }
    }

    // Safe substitution. Requires both argument denominators > 0.
    @method()
    static sSub(x: Fraction, y: Fraction): Fraction {
        assert(x.d > 0n && y.d > 0n)
        return {
            n: x.n * y.d - y.n * x.d,
            d: x.d * y.d,
        }
    }

    @method()
    static mul(x: Fraction, y: Fraction): Fraction {
        return {
            n: x.n * y.n,
            d: x.d * y.d,
        }
    }

    // Safe multiplication. Requires both argument denominators > 0.
    @method()
    static sMul(x: Fraction, y: Fraction): Fraction {
        assert(x.d > 0n && y.d > 0n)
        return {
            n: x.n * y.n,
            d: x.d * y.d,
        }
    }

    @method()
    static div(x: Fraction, y: Fraction): Fraction {
        return {
            n: x.n * y.d,
            d: x.d * y.n,
        }
    }

    // Safe division. Requires both argument denominators > 0 and y != 0.
    @method()
    static sDiv(x: Fraction, y: Fraction): Fraction {
        assert(x.d > 0n && y.d > 0n && y.n != 0n)
        return {
            n: x.n * y.d,
            d: x.d * y.n,
        }
    }

    @method()
    static abs(x: Fraction): Fraction {
        return {
            n: abs(x.n),
            d: abs(x.d),
        }
    }

    // Safe absolute. Requires both argument denominators > 0.
    @method()
    static sAbs(x: Fraction): Fraction {
        assert(x.d > 0n)
        return {
            n: abs(x.n),
            d: x.d,
        }
    }

    @method()
    static equal(x: Fraction, y: Fraction): boolean {
        return FRMath.sub(x, y).n == 0n
    }

    @method()
    static sEqual(x: Fraction, y: Fraction): boolean {
        return FRMath.sSub(x, y).n == 0n
    }

    @method()
    static toInt(x: Fraction): bigint {
        return x.n / x.d
    }

    @method()
    static fromInt(numerator: bigint, denominator: bigint): Fraction {
        return {
            n: numerator,
            d: denominator,
        }
    }

    @method()
    static scaleUp(x: Fraction, s: bigint): bigint {
        return (x.n * s) / x.d
    }
}
