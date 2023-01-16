import {
    and,
    reverseBytes,
    int2str,
    unpack,
    SmartContractLib,
    method,
    lshift,
    prop,
} from 'scrypt-ts'

export type FQ = bigint

export type FQ2 = {
    x: FQ
    y: FQ
}

export type FQ6 = {
    x: FQ2
    y: FQ2
    z: FQ2
}

// FQ12 implements the field of size p¹² as a quadratic extension of FQ6
// where ω²=τ.
export type FQ12 = {
    x: FQ6
    y: FQ6
}

export type CurvePoint = {
    x: FQ
    y: FQ
    z: FQ
    t: FQ
}

export type TwistPoint = {
    x: FQ2
    y: FQ2
    z: FQ2
    t: FQ2
}

// These two are just to make it easier for users to interface with the code
// by not having them to deal with z and t coords.
//
export type G1Point = {
    x: FQ
    y: FQ
}

export type G2Point = {
    x: FQ2
    y: FQ2
}

export class BN256 extends SmartContractLib {
    // Curve bits:
    @prop()
    static readonly CURVE_BITS = 256n
    @prop()
    static readonly CURVE_BITS_P8 = 264n // +8 bits
    @prop()
    static readonly CURVE_BITS_P8_DIV12 = 88n

    // Key int size:
    @prop()
    static readonly S = 33n // 32 bytes plus sign byte
    //@prop()
    //static readonly mask: ByteString = reverseBytes(int2str(1n, 33n), 33);
    //@prop()
    //static readonly zero: ByteString = reverseBytes(int2str(0n, 33n), 33);

    // Upper bound of the eGCD mod inverse loop:
    @prop()
    static readonly UB = 368n

    // Generator of G1:
    @prop()
    static readonly G1: CurvePoint = {
        x: 1n,
        y: 2n,
        z: 1n,
        t: 1n,
    }

    // Generator of G2:
    @prop()
    static readonly G2: TwistPoint = {
        x: {
            x: 11559732032986387107991004021392285783925812861821192530917403151452391805634n,
            y: 10857046999023057135944570762232829481370756359578518086990519993285655852781n,
        },
        y: {
            x: 4082367875863433681332203403145435568316851327593401208105741076214120093531n,
            y: 8495653923123431417604973247489272438418190587263600148770280649306958101930n,
        },
        z: {
            x: 0n,
            y: 1n,
        },
        t: {
            x: 0n,
            y: 1n,
        },
    }

    @prop()
    static readonly FQ2Zero: FQ2 = {
        x: 0n,
        y: 0n,
    }

    @prop()
    static readonly FQ2One: FQ2 = {
        x: 0n,
        y: 1n,
    }

    @prop()
    static readonly FQ6Zero: FQ6 = {
        x: BN256.FQ2Zero,
        y: BN256.FQ2Zero,
        z: BN256.FQ2Zero,
    }

    @prop()
    static readonly FQ6One: FQ6 = {
        x: BN256.FQ2Zero,
        y: BN256.FQ2Zero,
        z: BN256.FQ2One,
    }

    @prop()
    static readonly FQ12Zero: FQ12 = {
        x: BN256.FQ6Zero,
        y: BN256.FQ6Zero,
    }

    @prop()
    static readonly FQ12One: FQ12 = {
        x: BN256.FQ6Zero,
        y: BN256.FQ6One,
    }

    // Curve field modulus:
    @prop()
    static readonly P =
        21888242871839275222246405745257275088696311157297823662689037894645226208583n

    // xiToPMinus1Over6 is ξ^((p-1)/6) where ξ = i+9.
    @prop()
    static readonly xiToPMinus1Over6: FQ2 = {
        x: 16469823323077808223889137241176536799009286646108169935659301613961712198316n,
        y: 8376118865763821496583973867626364092589906065868298776909617916018768340080n,
    }

    // xiTo2PMinus2Over3 is ξ^((2p-2)/3) where ξ = i+9.
    @prop()
    static readonly xiTo2PMinus2Over3: FQ2 = {
        x: 19937756971775647987995932169929341994314640652964949448313374472400716661030n,
        y: 2581911344467009335267311115468803099551665605076196740867805258568234346338n,
    }

    // xiToPMinus1Over2 is ξ^((p-1)/2) where ξ = i+9.
    @prop()
    static readonly xiToPMinus1Over2: FQ2 = {
        x: 3505843767911556378687030309984248845540243509899259641013678093033130930403n,
        y: 2821565182194536844548159561693502659359617185244120367078079554186484126554n,
    }

    // xiToPMinus1Over3 is ξ^((p-1)/3) where ξ = i+9.
    @prop()
    static readonly xiToPMinus1Over3: FQ2 = {
        x: 10307601595873709700152284273816112264069230130616436755625194854815875713954n,
        y: 21575463638280843010398324269430826099269044274347216827212613867836435027261n,
    }

    // xiTo2PSquaredMinus2Over3 is ξ^((2p²-2)/3) where ξ = i+9 (a cubic root of unity, mod p).
    @prop()
    static readonly xiTo2PSquaredMinus2Over3: FQ =
        2203960485148121921418603742825762020974279258880205651966n

    // xiToPSquaredMinus1Over3 is ξ^((p²-1)/3) where ξ = i+9.
    @prop()
    static readonly xiToPSquaredMinus1Over3: FQ =
        21888242871839275220042445260109153167277707414472061641714758635765020556616n

    // xiToPSquaredMinus1Over6 is ξ^((1p²-1)/6) where ξ = i+9 (a cubic root of -1, mod p).
    @prop()
    static readonly xiToPSquaredMinus1Over6: FQ =
        21888242871839275220042445260109153167277707414472061641714758635765020556617n

    @method()
    static modReduce(x: bigint, modulus: bigint): bigint {
        // TODO: consistent across TS and sCrypt?
        const res = x % modulus
        return res < 0 ? res + modulus : res
    }

    @method()
    static modFQ2(t0: FQ2): FQ2 {
        t0.x = BN256.modReduce(t0.x, BN256.P)
        t0.y = BN256.modReduce(t0.y, BN256.P)
        return t0
    }

    @method()
    static modFQ12(t0: FQ12): FQ12 {
        t0.x.x.x = BN256.modReduce(t0.x.x.x, BN256.P)
        t0.x.x.y = BN256.modReduce(t0.x.x.y, BN256.P)
        t0.x.y.x = BN256.modReduce(t0.x.y.x, BN256.P)
        t0.x.y.y = BN256.modReduce(t0.x.y.y, BN256.P)
        t0.x.z.x = BN256.modReduce(t0.x.z.x, BN256.P)
        t0.x.z.y = BN256.modReduce(t0.x.z.y, BN256.P)
        t0.y.x.x = BN256.modReduce(t0.y.x.x, BN256.P)
        t0.y.x.y = BN256.modReduce(t0.y.x.y, BN256.P)
        t0.y.y.x = BN256.modReduce(t0.y.y.x, BN256.P)
        t0.y.y.y = BN256.modReduce(t0.y.y.y, BN256.P)
        t0.y.z.x = BN256.modReduce(t0.y.z.x, BN256.P)
        t0.y.z.y = BN256.modReduce(t0.y.z.y, BN256.P)
        return t0
    }

    @method()
    static modCurvePoint(t0: CurvePoint): CurvePoint {
        t0.x = BN256.modReduce(t0.x, BN256.P)
        t0.y = BN256.modReduce(t0.y, BN256.P)
        t0.z = BN256.modReduce(t0.z, BN256.P)
        t0.t = BN256.modReduce(t0.t, BN256.P)
        return t0
    }

    @method()
    static modTwistPoint(t0: TwistPoint): TwistPoint {
        t0.x.x = BN256.modReduce(t0.x.x, BN256.P)
        t0.x.y = BN256.modReduce(t0.x.y, BN256.P)
        t0.y.x = BN256.modReduce(t0.y.x, BN256.P)
        t0.y.y = BN256.modReduce(t0.y.y, BN256.P)
        t0.z.x = BN256.modReduce(t0.z.x, BN256.P)
        t0.z.y = BN256.modReduce(t0.z.y, BN256.P)
        t0.t.x = BN256.modReduce(t0.t.x, BN256.P)
        t0.t.y = BN256.modReduce(t0.t.y, BN256.P)
        return t0
    }

    @method()
    static mulFQ2(a: FQ2, b: FQ2): FQ2 {
        const tx = a.x * b.y
        const t = b.x * a.y
        const tx_2 = tx + t

        const ty = a.y * b.y
        const t_2 = a.x * b.x
        const ty_2 = ty - t_2

        const res: FQ2 = {
            x: BN256.modReduce(tx_2, BN256.P),
            y: BN256.modReduce(ty_2, BN256.P),
        }
        return res
    }

    @method()
    static mulXiFQ2(a: FQ2): FQ2 {
        // (xi+y)(i+3) = (9x+y)i+(9y-x)
        const tx = lshift(a.x, 3n) + a.x + a.y
        const ty = lshift(a.y, 3n) + a.y - a.x

        const res: FQ2 = {
            x: BN256.modReduce(tx, BN256.P),
            y: BN256.modReduce(ty, BN256.P),
        }
        return res
    }

    @method()
    static mulScalarFQ2(a: FQ2, scalar: bigint): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x * scalar, BN256.P),
            y: BN256.modReduce(a.y * scalar, BN256.P),
        }
        return res
    }

    @method()
    static addFQ2(a: FQ2, b: FQ2): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x + b.x, BN256.P),
            y: BN256.modReduce(a.y + b.y, BN256.P),
        }
        return res
    }

    @method()
    static subFQ2(a: FQ2, b: FQ2): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x - b.x, BN256.P),
            y: BN256.modReduce(a.y - b.y, BN256.P),
        }
        return res
    }

    @method()
    static negFQ2(a: FQ2): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x * -1n, BN256.P),
            y: BN256.modReduce(a.y * -1n, BN256.P),
        }
        return res
    }

    @method()
    static conjugateFQ2(a: FQ2): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x * -1n, BN256.P),
            y: BN256.modReduce(a.y, BN256.P),
        }
        return res
    }

    @method()
    static doubleFQ2(a: FQ2): FQ2 {
        const res: FQ2 = {
            x: BN256.modReduce(a.x * 2n, BN256.P),
            y: BN256.modReduce(a.y * 2n, BN256.P),
        }
        return res
    }

    @method()
    static squareFQ2(a: FQ2): FQ2 {
        const tx = a.y - a.x
        const ty = a.x + a.y
        const ty_2 = ty * tx

        const tx_2 = a.x * a.y * 2n

        const res: FQ2 = {
            x: BN256.modReduce(tx_2, BN256.P),
            y: BN256.modReduce(ty_2, BN256.P),
        }
        return res
    }

    @method()
    static modInverseBranchlessP(x: bigint): bigint {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        // The bellow code is ran while executing in a JS context.
        return BN256.modInverseEGCD(x, BN256.P)
    }

    @method()
    static modInverseEGCD(x: bigint, m: bigint): bigint {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        x = BN256.modReduce(x, BN256.P)

        let t = 0n
        let newt = 1n
        let r = m
        let newr = x

        let quotient = 0n
        let tmp = 0n
        for (let i = 0; i < BN256.UB; i++) {
            if (newr != 0n) {
                quotient = r / newr

                tmp = newt
                newt = t - quotient * newt
                t = tmp

                tmp = newr
                newr = r - quotient * newr
                r = tmp
            }
        }

        if (t < 0) {
            t = t + m
        }

        return t
    }

    @method()
    static inverseFQ2(a: FQ2): FQ2 {
        const t2 = a.y * a.y
        const t1 = a.x * a.x + t2

        const inv = BN256.modInverseBranchlessP(t1)

        const axNeg = a.x * -1n

        const res: FQ2 = {
            x: BN256.modReduce(axNeg * inv, BN256.P),
            y: BN256.modReduce(a.y * inv, BN256.P),
        }
        return res
    }

    @method()
    static mulFQ6(a: FQ6, b: FQ6): FQ6 {
        // "Multiplication and Squaring on Pairing-Friendly Fields"
        // Section 4, Karatsuba method.
        // http://eprint.iacr.org/2006/471.pdf

        const v0 = BN256.mulFQ2(a.z, b.z)
        const v1 = BN256.mulFQ2(a.y, b.y)
        const v2 = BN256.mulFQ2(a.x, b.x)

        let t0 = BN256.addFQ2(a.x, a.y)
        let t1 = BN256.addFQ2(b.x, b.y)
        let tz = BN256.mulFQ2(t0, t1)

        tz = BN256.subFQ2(tz, v1)
        tz = BN256.subFQ2(tz, v2)
        tz = BN256.mulXiFQ2(tz)
        tz = BN256.addFQ2(tz, v0)

        t0 = BN256.addFQ2(a.y, a.z)
        t1 = BN256.addFQ2(b.y, b.z)

        let ty = BN256.mulFQ2(t0, t1)
        ty = BN256.subFQ2(ty, v0)
        ty = BN256.subFQ2(ty, v1)
        t0 = BN256.mulXiFQ2(v2)
        ty = BN256.addFQ2(ty, t0)

        t0 = BN256.addFQ2(a.x, a.z)
        t1 = BN256.addFQ2(b.x, b.z)
        let tx = BN256.mulFQ2(t0, t1)
        tx = BN256.subFQ2(tx, v0)
        tx = BN256.addFQ2(tx, v1)
        tx = BN256.subFQ2(tx, v2)

        const res: FQ6 = {
            x: tx,
            y: ty,
            z: tz,
        }
        return res
    }

    @method()
    static doubleFQ6(a: FQ6): FQ6 {
        const res: FQ6 = {
            x: BN256.doubleFQ2(a.x),
            y: BN256.doubleFQ2(a.y),
            z: BN256.doubleFQ2(a.z),
        }
        return res
    }

    @method()
    static mulScalarFQ6(a: FQ6, scalar: FQ2): FQ6 {
        const res: FQ6 = {
            x: BN256.mulFQ2(a.x, scalar),
            y: BN256.mulFQ2(a.y, scalar),
            z: BN256.mulFQ2(a.z, scalar),
        }
        return res
    }

    @method()
    static addFQ6(a: FQ6, b: FQ6): FQ6 {
        const res: FQ6 = {
            x: BN256.addFQ2(a.x, b.x),
            y: BN256.addFQ2(a.y, b.y),
            z: BN256.addFQ2(a.z, b.z),
        }
        return res
    }

    @method()
    static subFQ6(a: FQ6, b: FQ6): FQ6 {
        const res: FQ6 = {
            x: BN256.subFQ2(a.x, b.x),
            y: BN256.subFQ2(a.y, b.y),
            z: BN256.subFQ2(a.z, b.z),
        }
        return res
    }

    @method()
    static negFQ6(a: FQ6): FQ6 {
        const res: FQ6 = {
            x: BN256.negFQ2(a.x),
            y: BN256.negFQ2(a.y),
            z: BN256.negFQ2(a.z),
        }
        return res
    }

    @method()
    static squareFQ6(a: FQ6): FQ6 {
        const v0 = BN256.squareFQ2(a.z)
        const v1 = BN256.squareFQ2(a.y)
        const v2 = BN256.squareFQ2(a.x)

        let c0 = BN256.addFQ2(a.x, a.y)
        c0 = BN256.squareFQ2(c0)
        c0 = BN256.subFQ2(c0, v1)
        c0 = BN256.subFQ2(c0, v2)
        c0 = BN256.mulXiFQ2(c0)
        c0 = BN256.addFQ2(c0, v0)

        let c1 = BN256.addFQ2(a.y, a.z)
        c1 = BN256.squareFQ2(c1)
        c1 = BN256.subFQ2(c1, v0)
        c1 = BN256.subFQ2(c1, v1)
        const xiV2 = BN256.mulXiFQ2(v2)
        c1 = BN256.addFQ2(c1, xiV2)

        let c2 = BN256.addFQ2(a.x, a.z)
        c2 = BN256.squareFQ2(c2)
        c2 = BN256.subFQ2(c2, v0)
        c2 = BN256.addFQ2(c2, v1)
        c2 = BN256.subFQ2(c2, v2)

        const res: FQ6 = {
            x: c2,
            y: c1,
            z: c0,
        }
        return res
    }

    @method()
    static mulTauFQ6(a: FQ6): FQ6 {
        // MulTau computes τ·(aτ²+bτ+c) = bτ²+cτ+aξ
        const res: FQ6 = {
            x: a.y,
            y: a.z,
            z: BN256.mulXiFQ2(a.x),
        }
        return res
    }

    @method()
    static inverseFQ6(a: FQ6): FQ6 {
        // See "Implementing cryptographic pairings", M. Scott, section 3.2.
        // ftp://136.206.11.249/pub/crypto/pairings.pdf

        // Here we can give a short explanation of how it works: let j be a cubic root of
        // unity in GF(p²) so that 1+j+j²=0.
        // Then (xτ² + yτ + z)(xj²τ² + yjτ + z)(xjτ² + yj²τ + z)
        // = (xτ² + yτ + z)(Cτ²+Bτ+A)
        // = (x³ξ²+y³ξ+z³-3ξxyz) = F is an element of the base field (the norm).
        //
        // On the other hand (xj²τ² + yjτ + z)(xjτ² + yj²τ + z)
        // = τ²(y²-ξxz) + τ(ξx²-yz) + (z²-ξxy)
        //
        // So that's why A = (z²-ξxy), B = (ξx²-yz), C = (y²-ξxz)

        let A = BN256.squareFQ2(a.z)
        let t1 = BN256.mulFQ2(a.x, a.y)
        t1 = BN256.mulXiFQ2(t1)
        A = BN256.subFQ2(A, t1)

        let B = BN256.squareFQ2(a.x)
        B = BN256.mulXiFQ2(B)
        t1 = BN256.mulFQ2(a.y, a.z)
        B = BN256.subFQ2(B, t1)

        let C = BN256.squareFQ2(a.y)
        t1 = BN256.mulFQ2(a.x, a.z)
        C = BN256.subFQ2(C, t1)

        let F = BN256.mulFQ2(C, a.y)
        F = BN256.mulXiFQ2(F)
        t1 = BN256.mulFQ2(A, a.z)
        F = BN256.addFQ2(F, t1)
        t1 = BN256.mulFQ2(B, a.x)
        t1 = BN256.mulXiFQ2(t1)
        F = BN256.addFQ2(F, t1)

        F = BN256.inverseFQ2(F)

        const res: FQ6 = {
            x: BN256.mulFQ2(C, F),
            y: BN256.mulFQ2(B, F),
            z: BN256.mulFQ2(A, F),
        }
        return res
    }

    @method()
    static mulScalarFQ12(a: FQ12, scalar: FQ6): FQ12 {
        const res: FQ12 = {
            x: BN256.mulFQ6(a.x, scalar),
            y: BN256.mulFQ6(a.y, scalar),
        }
        return res
    }

    @method()
    static inverseFQ12(a: FQ12): FQ12 {
        // See "Implementing cryptographic pairings", M. Scott, section 3.2.
        // ftp://136.206.11.249/pub/crypto/pairings.pdf

        const t1 = BN256.squareFQ6(a.x)
        const t2 = BN256.squareFQ6(a.y)
        const t1_2 = BN256.mulTauFQ6(t1)
        const t1_3 = BN256.subFQ6(t2, t1_2)
        const t2_2 = BN256.inverseFQ6(t1_3)

        const e: FQ12 = {
            x: BN256.negFQ6(a.x),
            y: a.y,
        }

        return BN256.mulScalarFQ12(e, t2_2)
    }

    @method()
    static mulFQ12(a: FQ12, b: FQ12): FQ12 {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        const tx = BN256.mulFQ6(a.x, b.y)
        const t = BN256.mulFQ6(b.x, a.y)
        const tx2 = BN256.addFQ6(tx, t)

        const ty = BN256.mulFQ6(a.y, b.y)
        const t2 = BN256.mulFQ6(a.x, b.x)
        const t3 = BN256.mulTauFQ6(t2)

        const res: FQ12 = {
            x: tx2,
            y: BN256.addFQ6(ty, t3),
        }
        return res
    }

    @method()
    static forbeniusFQ6(a: FQ6): FQ6 {
        const res: FQ6 = {
            x: BN256.mulFQ2(BN256.conjugateFQ2(a.x), BN256.xiTo2PMinus2Over3),
            y: BN256.mulFQ2(BN256.conjugateFQ2(a.y), BN256.xiToPMinus1Over3),
            z: BN256.conjugateFQ2(a.z),
        }
        return res
    }

    @method()
    static forbeniusP2FQ6(a: FQ6): FQ6 {
        // FrobeniusP2 computes (xτ²+yτ+z)^(p²) = xτ^(2p²) + yτ^(p²) + z
        const res: FQ6 = {
            // τ^(2p²) = τ²τ^(2p²-2) = τ²ξ^((2p²-2)/3)
            x: BN256.mulScalarFQ2(a.x, BN256.xiTo2PSquaredMinus2Over3),
            // τ^(p²) = ττ^(p²-1) = τξ^((p²-1)/3)
            y: BN256.mulScalarFQ2(a.x, BN256.xiToPSquaredMinus1Over3),
            z: a.z,
        }
        return res
    }

    @method()
    static mulGFP(a: FQ6, b: bigint): FQ6 {
        const res: FQ6 = {
            x: BN256.mulScalarFQ2(a.x, b),
            y: BN256.mulScalarFQ2(a.y, b),
            z: BN256.mulScalarFQ2(a.z, b),
        }
        return res
    }

    @method()
    static conjugateFQ12(a: FQ12): FQ12 {
        const res: FQ12 = {
            x: BN256.negFQ6(a.x),
            y: a.y,
        }
        return res
    }

    @method()
    static forbeniusFQ12(a: FQ12): FQ12 {
        // Frobenius computes (xω+y)^p = x^p ω·ξ^((p-1)/6) + y^p
        const res: FQ12 = {
            x: BN256.mulScalarFQ6(
                BN256.forbeniusFQ6(a.x),
                BN256.xiToPMinus1Over6
            ),
            y: BN256.forbeniusFQ6(a.y),
        }
        return res
    }

    @method()
    static forbeniusP2FQ12(a: FQ12): FQ12 {
        // FrobeniusP2 computes (xω+y)^p² = x^p² ω·ξ^((p²-1)/6) + y^p²
        const res: FQ12 = {
            x: BN256.mulGFP(
                BN256.forbeniusP2FQ6(a.x),
                BN256.xiToPSquaredMinus1Over6
            ),
            y: BN256.forbeniusP2FQ6(a.y),
        }
        return res
    }

    @method()
    static squareFQ12(a: FQ12): FQ12 {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        // Complex squaring algorithm
        const v0 = BN256.mulFQ6(a.x, a.y)

        const t = BN256.mulTauFQ6(a.x)
        const t2 = BN256.addFQ6(a.y, t)
        const ty = BN256.addFQ6(a.x, a.y)
        const ty2 = BN256.mulFQ6(ty, t2)
        const ty3 = BN256.subFQ6(ty2, v0)
        const t3 = BN256.mulTauFQ6(v0)

        const ty4 = BN256.subFQ6(ty3, t3)

        const res: FQ12 = {
            x: BN256.doubleFQ6(v0),
            y: ty4,
        }
        return res
    }

    @method()
    static expFQ12_u(a: FQ12): FQ12 {
        // u is the BN parameter that determines the prime.
        // u = 4965661367192848881;
        const sum = BN256.FQ12One

        // Unrolled loop. Reference impl.:
        // https://github.com/ethereum/go-ethereum/blob/bd6879ac518431174a490ba42f7e6e822dcb3ee1/crypto/bn256/google/gfp12.go#L138
        let sum0 = BN256.squareFQ12(sum)
        sum0 = BN256.modFQ12(sum0)
        const sum1 = BN256.mulFQ12(sum0, a)
        const sum2 = BN256.squareFQ12(sum1)
        const sum3 = BN256.squareFQ12(sum2)
        const sum4 = BN256.squareFQ12(sum3)
        const sum5 = BN256.squareFQ12(sum4)
        const sum6 = BN256.mulFQ12(sum5, a)
        const sum7 = BN256.squareFQ12(sum6)
        const sum8 = BN256.squareFQ12(sum7)
        const sum9 = BN256.squareFQ12(sum8)
        let sum10 = BN256.mulFQ12(sum9, a)
        sum10 = BN256.modFQ12(sum10)
        const sum11 = BN256.squareFQ12(sum10)
        const sum12 = BN256.mulFQ12(sum11, a)
        const sum13 = BN256.squareFQ12(sum12)
        const sum14 = BN256.mulFQ12(sum13, a)
        const sum15 = BN256.squareFQ12(sum14)
        const sum16 = BN256.squareFQ12(sum15)
        const sum17 = BN256.mulFQ12(sum16, a)
        const sum18 = BN256.squareFQ12(sum17)
        const sum19 = BN256.squareFQ12(sum18)
        let sum20 = BN256.squareFQ12(sum19)
        sum20 = BN256.modFQ12(sum20)
        const sum21 = BN256.mulFQ12(sum20, a)
        const sum22 = BN256.squareFQ12(sum21)
        const sum23 = BN256.mulFQ12(sum22, a)
        const sum24 = BN256.squareFQ12(sum23)
        const sum25 = BN256.squareFQ12(sum24)
        const sum26 = BN256.squareFQ12(sum25)
        const sum27 = BN256.mulFQ12(sum26, a)
        const sum28 = BN256.squareFQ12(sum27)
        const sum29 = BN256.squareFQ12(sum28)
        let sum30 = BN256.squareFQ12(sum29)
        sum30 = BN256.modFQ12(sum30)
        const sum31 = BN256.mulFQ12(sum30, a)
        const sum32 = BN256.squareFQ12(sum31)
        const sum33 = BN256.squareFQ12(sum32)
        const sum34 = BN256.mulFQ12(sum33, a)
        const sum35 = BN256.squareFQ12(sum34)
        const sum36 = BN256.squareFQ12(sum35)
        const sum37 = BN256.mulFQ12(sum36, a)
        const sum38 = BN256.squareFQ12(sum37)
        const sum39 = BN256.mulFQ12(sum38, a)
        let sum40 = BN256.squareFQ12(sum39)
        sum40 = BN256.modFQ12(sum40)
        const sum41 = BN256.squareFQ12(sum40)
        const sum42 = BN256.mulFQ12(sum41, a)
        const sum43 = BN256.squareFQ12(sum42)
        const sum44 = BN256.squareFQ12(sum43)
        const sum45 = BN256.squareFQ12(sum44)
        const sum46 = BN256.squareFQ12(sum45)
        const sum47 = BN256.mulFQ12(sum46, a)
        const sum48 = BN256.squareFQ12(sum47)
        const sum49 = BN256.squareFQ12(sum48)
        let sum50 = BN256.squareFQ12(sum49)
        sum50 = BN256.modFQ12(sum50)
        const sum51 = BN256.mulFQ12(sum50, a)
        const sum52 = BN256.squareFQ12(sum51)
        const sum53 = BN256.squareFQ12(sum52)
        const sum54 = BN256.mulFQ12(sum53, a)
        const sum55 = BN256.squareFQ12(sum54)
        const sum56 = BN256.squareFQ12(sum55)
        const sum57 = BN256.squareFQ12(sum56)
        const sum58 = BN256.mulFQ12(sum57, a)
        const sum59 = BN256.squareFQ12(sum58)
        let sum60 = BN256.mulFQ12(sum59, a)
        sum60 = BN256.modFQ12(sum60)
        const sum61 = BN256.squareFQ12(sum60)
        const sum62 = BN256.squareFQ12(sum61)
        const sum63 = BN256.mulFQ12(sum62, a)
        const sum64 = BN256.squareFQ12(sum63)
        const sum65 = BN256.squareFQ12(sum64)
        const sum66 = BN256.squareFQ12(sum65)
        const sum67 = BN256.mulFQ12(sum66, a)
        const sum68 = BN256.squareFQ12(sum67)
        const sum69 = BN256.squareFQ12(sum68)
        let sum70 = BN256.squareFQ12(sum69)
        sum70 = BN256.modFQ12(sum70)
        const sum71 = BN256.squareFQ12(sum70)
        const sum72 = BN256.squareFQ12(sum71)
        const sum73 = BN256.mulFQ12(sum72, a)
        const sum74 = BN256.squareFQ12(sum73)
        const sum75 = BN256.squareFQ12(sum74)
        const sum76 = BN256.squareFQ12(sum75)
        const sum77 = BN256.mulFQ12(sum76, a)
        const sum78 = BN256.squareFQ12(sum77)
        const sum79 = BN256.mulFQ12(sum78, a)
        let sum80 = BN256.squareFQ12(sum79)
        sum80 = BN256.modFQ12(sum80)
        const sum81 = BN256.mulFQ12(sum80, a)
        const sum82 = BN256.squareFQ12(sum81)
        const sum83 = BN256.mulFQ12(sum82, a)
        const sum84 = BN256.squareFQ12(sum83)
        const sum85 = BN256.mulFQ12(sum84, a)
        const sum86 = BN256.squareFQ12(sum85)
        const sum87 = BN256.squareFQ12(sum86)
        const sum88 = BN256.squareFQ12(sum87)
        const sum89 = BN256.squareFQ12(sum88)
        let sum90 = BN256.mulFQ12(sum89, a)
        sum90 = BN256.modFQ12(sum90)

        return sum90
    }

    @method()
    static expFQ12(a: FQ12, power: bigint): FQ12 {
        // TODO: can precalc "shifted" and "mb"
        let sum = BN256.FQ12One
        let t = BN256.FQ12One

        const mb = unpack(
            reverseBytes(int2str(power, BigInt(BN256.S)), Number(BN256.S))
        )
        let firstOne = false

        for (let i = 0; i < BN256.CURVE_BITS_P8; i++) {
            if (firstOne) {
                t = BN256.squareFQ12(sum)
            }

            const shifted = lshift(
                1n,
                BigInt(Number(BN256.CURVE_BITS_P8) - 1 - i)
            )

            if (and(mb, shifted) != 0n) {
                firstOne = true
                sum = BN256.mulFQ12(t, a)
            } else {
                sum = t
            }
        }

        return sum
    }

    @method()
    static doubleG1Point(a: G1Point): G1Point {
        const res = BN256.doubleCurvePoint(BN256.createCurvePoint(a))
        return BN256.getG1Point(res)
    }

    @method()
    static doubleCurvePoint(a: CurvePoint): CurvePoint {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        // See http://hyperelliptic.org/EFD/g1p/auto-code/shortw/jacobian-0/doubling/dbl-2009-l.op3
        const res: CurvePoint = {
            x: 0n,
            y: 0n,
            z: 0n,
            t: 0n,
        }

        const A = BN256.modReduce(a.x * a.x, BN256.P)
        const B = BN256.modReduce(a.y * a.y, BN256.P)
        const C = BN256.modReduce(B * B, BN256.P)

        let t = a.x + B
        let t2 = BN256.modReduce(t * t, BN256.P)
        t = t2 - A
        t2 = t - C

        const d = t2 * 2n
        t = A * 2n
        const e = t + A
        const f = BN256.modReduce(e * e, BN256.P)

        t = d * 2n
        res.x = f - t

        t = C * 2n
        t2 = t * 2n
        t = t2 * 2n
        res.y = d - res.x
        t2 = BN256.modReduce(e * res.y, BN256.P)
        res.y = t2 - t

        const prod = a.y * a.z
        res.z = BN256.modReduce(prod, BN256.P) * 2n

        return res
    }

    @method()
    static addG1Point(a: G1Point, b: G1Point): G1Point {
        const res = BN256.addCurvePoints(
            BN256.P,
            BN256.createCurvePoint(a),
            BN256.createCurvePoint(b)
        )
        return BN256.getG1Point(res)
    }

    @method()
    static addCurvePoints(P: bigint, a: CurvePoint, b: CurvePoint): CurvePoint {
        // TODO: This will get substituted by optimized ASM code at transpilation stage.
        // See http://hyperelliptic.org/EFD/g1p/auto-code/shortw/jacobian-0/addition/add-2007-bl.op3
        let res: CurvePoint = {
            x: 0n,
            y: 0n,
            z: 0n,
            t: 0n,
        }

        if (a.z == 0n) {
            res = b
        } else if (b.z == 0n) {
            res = a
        } else {
            // Normalize the points by replacing a = [x1:y1:z1] and b = [x2:y2:z2]
            // by [u1:s1:z1·z2] and [u2:s2:z1·z2]
            // where u1 = x1·z2², s1 = y1·z2³ and u1 = x2·z1², s2 = y2·z1³

            const z12 = BN256.modReduce(a.z * a.z, P)
            const z22 = BN256.modReduce(b.z * b.z, P)

            const u1 = BN256.modReduce(a.x * z22, P)
            const u2 = BN256.modReduce(b.x * z12, P)

            let t = BN256.modReduce(b.z * z22, P)
            const s1 = BN256.modReduce(a.y * t, P)

            t = BN256.modReduce(a.z * z12, P)
            const s2 = BN256.modReduce(b.y * t, P)

            // Compute x = (2h)²(s²-u1-u2)
            // where s = (s2-s1)/(u2-u1) is the slope of the line through
            // (u1,s1) and (u2,s2). The extra factor 2h = 2(u2-u1) comes from the value of z below.
            // This is also:
            // 4(s2-s1)² - 4h²(u1+u2) = 4(s2-s1)² - 4h³ - 4h²(2u1)
            //                        = r² - j - 2v
            // with the notations below.

            const h = u2 - u1
            const xEqual = h == 0n

            t = h * 2n
            // i = 4h²
            const i = BN256.modReduce(t * t, P)
            // j = 4h³
            const j = BN256.modReduce(h * i, P)

            t = s2 - s1
            const yEqual = t == 0n

            if (xEqual && yEqual) {
                res = BN256.doubleCurvePoint(a)
            } else {
                const r = t + t
                const v = BN256.modReduce(u1 * i, P)

                // t4 = 4(s2-s1)²
                let t4 = BN256.modReduce(r * r, P)
                let t6 = t4 - j
                t = v * 2n

                res.x = t6 - t

                // Set y = -(2h)³(s1 + s*(x/4h²-u1))
                // This is also
                // y = - 2·s1·j - (s2-s1)(2x - 2i·u1) = r(v-x) - 2·s1·j
                t = v - res.x
                t4 = BN256.modReduce(s1 * j, P)
                t6 = t4 * 2n
                t4 = BN256.modReduce(r * t, P)
                res.y = t4 - t6

                // Set z = 2(u2-u1)·z1·z2 = 2h·z1·z2
                t = a.z + b.z
                t4 = BN256.modReduce(t * t, P)
                t = t4 - z12
                t4 = t - z22
                res.z = BN256.modReduce(t4 * h, P)
            }
        }

        return res
    }

    @method()
    static mulG1Point(a: G1Point, m: bigint): G1Point {
        const res = BN256.mulCurvePoint(BN256.createCurvePoint(a), m)
        return BN256.getG1Point(res)
    }

    @method()
    static mulCurvePoint(a: CurvePoint, m: bigint): CurvePoint {
        let res: CurvePoint = {
            x: 0n,
            y: 1n,
            z: 0n,
            t: 0n,
        }

        if (m != 0n) {
            // Double and add method.
            // Lowest bit to highest.
            let t: CurvePoint = {
                x: 0n,
                y: 0n,
                z: 0n,
                t: 0n,
            }
            let sum: CurvePoint = {
                x: 0n,
                y: 0n,
                z: 0n,
                t: 0n,
            }

            const mb = unpack(
                reverseBytes(int2str(m, BigInt(BN256.S)), Number(BN256.S))
            )
            let firstOne = false

            for (let k = 0; k < BN256.CURVE_BITS_P8_DIV12; k++) {
                for (let j = 0; j < 3; j++) {
                    if (firstOne) {
                        t = BN256.doubleCurvePoint(sum)
                    }
                    const shifted = lshift(
                        1n,
                        BigInt(Number(BN256.CURVE_BITS) - 1 - (3 * k + j))
                    )
                    if (and(mb, shifted) != 0n) {
                        firstOne = true
                        sum = BN256.addCurvePoints(BN256.P, t, a)
                    } else {
                        sum = t
                    }
                }
                sum = BN256.modCurvePoint(sum)
            }
            res = sum
        }

        return res
    }

    @method()
    static makeAffineCurvePoint(a: CurvePoint): CurvePoint {
        // MakeAffine converts a to affine form. If c is ∞, then it sets
        // a to 0 : 1 : 0.

        let res = a
        if (BN256.modReduce(a.z, BN256.P) != 1n) {
            if (a.z == 0n) {
                // TODO: Fix once https://github.com/sCrypt-Inc/scrypt-ts/issues/123 is done
                res = {
                    x: 0n,
                    y: 1n,
                    z: 0n,
                    t: 0n,
                }
            } else {
                const zInv = BN256.modInverseBranchlessP(a.z)
                const t = BN256.modReduce(a.y * zInv, BN256.P)
                const zInv2 = BN256.modReduce(zInv * zInv, BN256.P)
                const ay = BN256.modReduce(t * zInv2, BN256.P)
                const ax = BN256.modReduce(a.x * zInv2, BN256.P)

                res = {
                    x: ax,
                    y: ay,
                    z: 1n,
                    t: 1n,
                }
            }
        }

        return res
    }

    @method()
    static negCurvePoint(a: CurvePoint): CurvePoint {
        const res: CurvePoint = {
            x: a.x,
            y: -a.y,
            z: a.z,
            t: 0n,
        }
        return res
    }

    @method()
    static isInfCurvePoint(a: CurvePoint): boolean {
        return a.z == 0n
    }

    @method()
    static createCurvePoint(ccp: G1Point): CurvePoint {
        let res: CurvePoint = {
            x: ccp.x,
            y: ccp.y,
            z: 1n,
            t: 1n,
        }
        if (ccp.x == 0n && ccp.y == 0n) {
            res = {
                x: 0n,
                y: 1n,
                z: 0n,
                t: 0n,
            }
        }
        return res
    }

    @method()
    static getG1Point(cp: CurvePoint): G1Point {
        const acp = BN256.makeAffineCurvePoint(cp)
        let res: G1Point = {
            x: acp.x,
            y: acp.y,
        }
        if (acp.x == 0n && acp.y == 1n && acp.z == 0n && acp.t == 0n) {
            res = {
                x: 0n,
                y: 0n,
            }
        }
        return res
    }

    @method()
    static doubleG2Point(a: G2Point): G2Point {
        const res = BN256.doubleTwistPoint(BN256.createTwistPoint(a))

        return BN256.getG2Point(res)
    }

    @method()
    static doubleTwistPoint(a: TwistPoint): TwistPoint {
        // See http://hyperelliptic.org/EFD/g1p/auto-code/shortw/jacobian-0/doubling/dbl-2009-l.op3

        const res: TwistPoint = {
            x: BN256.FQ2Zero,
            y: BN256.FQ2Zero,
            z: BN256.FQ2Zero,
            t: BN256.FQ2Zero,
        }

        const A = BN256.squareFQ2(a.x)
        const B = BN256.squareFQ2(a.y)
        const C = BN256.squareFQ2(B)

        let t = BN256.addFQ2(a.x, B)
        let t2 = BN256.squareFQ2(t)
        t = BN256.subFQ2(t2, A)
        t2 = BN256.subFQ2(t, C)

        const d = BN256.mulScalarFQ2(t2, 2n)
        t = BN256.mulScalarFQ2(A, 2n)
        const e = BN256.addFQ2(t, A)
        const f = BN256.squareFQ2(e)

        t = BN256.mulScalarFQ2(d, 2n)
        res.x = BN256.subFQ2(f, t)

        t = BN256.mulScalarFQ2(C, 2n)
        t2 = BN256.mulScalarFQ2(t, 2n)
        t = BN256.mulScalarFQ2(t2, 2n)
        res.y = BN256.subFQ2(d, res.x)
        t2 = BN256.mulFQ2(e, res.y)
        res.y = BN256.subFQ2(t2, t)

        res.z = BN256.mulScalarFQ2(BN256.mulFQ2(a.y, a.z), 2n)

        return res
    }

    @method()
    static addG2Points(a: G2Point, b: G2Point): G2Point {
        const res = BN256.addTwistPoints(
            BN256.createTwistPoint(a),
            BN256.createTwistPoint(b)
        )

        return BN256.getG2Point(res)
    }

    @method()
    static addTwistPoints(a: TwistPoint, b: TwistPoint): TwistPoint {
        let res: TwistPoint = {
            x: BN256.FQ2Zero,
            y: BN256.FQ2Zero,
            z: BN256.FQ2Zero,
            t: a.t,
        }

        if (a.z == BN256.FQ2Zero) {
            res = b
        } else if (b.z == BN256.FQ2Zero) {
            res = a
        } else {
            // See http://hyperelliptic.org/EFD/g1p/auto-code/shortw/jacobian-0/addition/add-2007-bl.op3

            // Normalize the points by replacing a = [x1:y1:z1] and b = [x2:y2:z2]
            // by [u1:s1:z1·z2] and [u2:s2:z1·z2]
            // where u1 = x1·z2², s1 = y1·z2³ and u1 = x2·z1², s2 = y2·z1³

            const z12 = BN256.squareFQ2(a.z)
            const z22 = BN256.squareFQ2(b.z)

            const u1 = BN256.mulFQ2(a.x, z22)
            const u2 = BN256.mulFQ2(b.x, z12)

            let t = BN256.mulFQ2(b.z, z22)
            const s1 = BN256.mulFQ2(a.y, t)

            t = BN256.mulFQ2(a.z, z12)
            const s2 = BN256.mulFQ2(b.y, t)

            // Compute x = (2h)²(s²-u1-u2)
            // where s = (s2-s1)/(u2-u1) is the slope of the line through
            // (u1,s1) and (u2,s2). The extra factor 2h = 2(u2-u1) comes from the value of z below.
            // This is also:
            // 4(s2-s1)² - 4h²(u1+u2) = 4(s2-s1)² - 4h³ - 4h²(2u1)
            //                        = r² - j - 2v
            // with the notations below.

            const h = BN256.subFQ2(u2, u1)
            const xEqual = h == BN256.FQ2Zero

            t = BN256.mulScalarFQ2(h, 2n)
            // i = 4h²
            const i = BN256.squareFQ2(t)
            // j = 4h³
            const j = BN256.mulFQ2(h, i)

            t = BN256.subFQ2(s2, s1)
            const yEqual = t == BN256.FQ2Zero
            if (xEqual && yEqual) {
                res = BN256.doubleTwistPoint(a)
            } else {
                const r = BN256.mulScalarFQ2(t, 2n)
                const v = BN256.mulFQ2(u1, i)

                // t4 = 4(s2-s1)²
                let t4 = BN256.squareFQ2(r)
                let t6 = BN256.subFQ2(t4, j)
                t = BN256.mulScalarFQ2(v, 2n)

                res.x = BN256.subFQ2(t6, t)

                // Set y = -(2h)³(s1 + s*(x/4h²-u1))
                // This is also
                // y = - 2·s1·j - (s2-s1)(2x - 2i·u1) = r(v-x) - 2·s1·j
                t = BN256.subFQ2(v, res.x)
                t4 = BN256.mulFQ2(s1, j)
                t6 = BN256.mulScalarFQ2(t4, 2n)
                t4 = BN256.mulFQ2(r, t)
                res.y = BN256.subFQ2(t4, t6)

                // Set z = 2(u2-u1)·z1·z2 = 2h·z1·z2
                t = BN256.addFQ2(a.z, b.z)
                t4 = BN256.squareFQ2(t)
                t = BN256.subFQ2(t4, z12)
                t4 = BN256.subFQ2(t, z22)
                res.z = BN256.mulFQ2(t4, h)
            }
        }

        return res
    }

    @method()
    static makeAffineTwistPoint(a: TwistPoint): TwistPoint {
        let res = a
        if (a.z.x != 0n || a.z.y != 1n) {
            if (a.z == BN256.FQ2Zero) {
                res = {
                    x: BN256.FQ2Zero,
                    y: BN256.FQ2One,
                    z: BN256.FQ2Zero,
                    t: BN256.FQ2Zero,
                }
            } else {
                const zInv = BN256.inverseFQ2(a.z)
                let t = BN256.mulFQ2(a.y, zInv)
                const zInv2 = BN256.squareFQ2(zInv)
                res.y = BN256.mulFQ2(t, zInv2)
                t = BN256.mulFQ2(a.x, zInv2)
                res.x = t

                const zTmp: FQ2 = { x: 0n, y: 1n }
                res.z = zTmp
                res.t = zTmp
            }
        }

        return res
    }

    @method()
    static negTwistPoint(a: TwistPoint): TwistPoint {
        const res: TwistPoint = {
            x: a.x,
            y: BN256.subFQ2(BN256.FQ2Zero, a.y),
            z: a.z,
            t: BN256.FQ2Zero,
        }
        return res
    }

    @method()
    static isInfTwistPoint(a: TwistPoint): boolean {
        return a.z == BN256.FQ2Zero
    }

    @method()
    static createTwistPoint(ctp: G2Point): TwistPoint {
        // Output x and y coords from ZoKrates need to be swaped to work correctly.
        const x: FQ2 = {
            x: ctp.x.y,
            y: ctp.x.x,
        }
        const y: FQ2 = {
            x: ctp.y.y,
            y: ctp.y.x,
        }

        let res: TwistPoint = {
            x: x,
            y: y,
            z: BN256.FQ2One,
            t: BN256.FQ2One,
        }

        if (ctp.x == BN256.FQ2Zero && ctp.y == BN256.FQ2Zero) {
            res = {
                x: BN256.FQ2Zero,
                y: BN256.FQ2One,
                z: BN256.FQ2Zero,
                t: BN256.FQ2Zero,
            }
        }
        return res
    }

    @method()
    static getG2Point(tp: TwistPoint): G2Point {
        const atp = BN256.makeAffineTwistPoint(tp)
        let res: G2Point = {
            x: atp.x,
            y: atp.y,
        }

        if (
            atp.x == BN256.FQ2Zero &&
            atp.y == BN256.FQ2One &&
            atp.z == BN256.FQ2Zero &&
            atp.t == BN256.FQ2Zero
        ) {
            res = {
                x: BN256.FQ2Zero,
                y: BN256.FQ2Zero,
            }
        }
        return res
    }
}
