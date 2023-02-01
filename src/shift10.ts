import { assert } from 'console'
import { prop, method, SmartContractLib, FixedArray } from 'scrypt-ts'

/*
NOTICES:
    1) due to the computational nature of base 10, pow(n) is limited (n=10^999 as max value)
    2) import of this module adds ~40 bytes to a contract, even if not using any of its functions
       (subject to change, depending on future compiler optimizations)
*/
export class Shift10 extends SmartContractLib {
    @prop()
    static readonly i1: bigint = 10n
    @prop()
    static readonly i2: bigint = 100n
    @prop()
    static readonly i3: bigint = 1000n
    @prop()
    static readonly i4: bigint = 10000n
    @prop()
    static readonly i5: bigint = 100000n

    @prop()
    static readonly arr0: FixedArray<bigint, 10> = [
        1n,
        Shift10.i1,
        Shift10.i2,
        Shift10.i3,
        Shift10.i4,
        Shift10.i5,
        Shift10.i5 * Shift10.i1,
        Shift10.i5 * Shift10.i2,
        Shift10.i5 * Shift10.i3,
        Shift10.i5 * Shift10.i4,
    ]

    @prop()
    static readonly i1_1: bigint = Shift10.i5 * Shift10.i5 // 10000000000
    @prop()
    static readonly i2_1: bigint = Shift10.i1_1 * Shift10.i1_1
    @prop()
    static readonly i3_1: bigint = Shift10.i2_1 * Shift10.i1_1
    @prop()
    static readonly i4_1: bigint = Shift10.i2_1 * Shift10.i2_1
    @prop()
    static readonly i5_1: bigint = Shift10.i4_1 * Shift10.i1_1
    @prop()
    static readonly arr1: FixedArray<bigint, 10> = [
        // 1, i1_1, i2_1, i1_1*i2_1, i2_1*i2_1, i5_1, i5_1*i1_1, i5_1*i2_1, i5_1*i1_1*i2_1, i5_1*i2_1*i2_1
        1n,
        Shift10.i1_1,
        Shift10.i2_1,
        Shift10.i3_1,
        Shift10.i4_1,
        Shift10.i5_1,
        Shift10.i5_1 * Shift10.i1_1,
        Shift10.i5_1 * Shift10.i2_1,
        Shift10.i5_1 * Shift10.i3_1,
        Shift10.i5_1 * Shift10.i4_1,
    ]

    @prop()
    static readonly i1_2: bigint = Shift10.i5_1 * Shift10.i5_1
    @prop()
    static readonly i2_2: bigint = Shift10.i1_2 * Shift10.i1_2
    @prop()
    static readonly i3_2: bigint = Shift10.i2_2 * Shift10.i1_2
    @prop()
    static readonly i4_2: bigint = Shift10.i2_2 * Shift10.i2_2
    @prop()
    static readonly i5_2: bigint = Shift10.i4_2 * Shift10.i1_2
    @prop()
    static readonly arr2: FixedArray<bigint, 10> = [
        // 1, i1_2, i2_2, i1_2*i2_2, i2_2*i2_2, i5_2, i5_2*i1_2, i5_2*i2_2, i5_2*i1_2*i2_2, i5_2*i2_2*i2_2
        1n,
        Shift10.i1_2,
        Shift10.i2_2,
        Shift10.i3_2,
        Shift10.i4_2,
        Shift10.i5_2,
        Shift10.i5_2 * Shift10.i1_2,
        Shift10.i5_2 * Shift10.i2_2,
        Shift10.i5_2 * Shift10.i3_2,
        Shift10.i5_2 * Shift10.i4_2,
    ]

    // Return 10^n.
    @method()
    static pow(n: bigint): bigint {
        // FAIL otherwise
        assert(n <= 999n)

        return (
            Shift10.arr0[Number(n % 10n)] *
            Shift10.arr1[Number((n / 10n) % 10n)] *
            Shift10.arr2[Number((n / 100n) % 10n)]
        )
    }

    // Base10 left shift number x by n places.
    @method()
    static left(x: bigint, n: bigint): bigint {
        return x * Shift10.pow(n)
    }

    // Base10 right shift number x by n places.
    @method()
    static right(x: bigint, n: bigint): bigint {
        return x / Shift10.pow(n)
    }
}
