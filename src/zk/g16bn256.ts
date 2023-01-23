import { SmartContractLib, method, prop, FixedArray } from 'scrypt-ts'
import { FQ12, G2Point, G1Point, BN256, BN256Pairing } from '../ec/bn256'

export type VerifyingKey = {
    millerb1a1: FQ12 // Precalculated miller(alpha, beta)
    gamma: G2Point
    delta: G2Point
    gammaAbc: FixedArray<G1Point, 2> // Size of array should be N + 1
}

export type Proof = {
    a: G1Point
    b: G2Point
    c: G1Point
}

export class G16BN256 extends SmartContractLib {
    @prop()
    static readonly N = 1n // Number of public inputs.

    @prop()
    static readonly N_1 = 2n // N + 1

    @method()
    //static vkXSetup(inputs: FixedArray<bigint, G16BN256.N>, vk: VerifyingKey): G1Point {
    static vkXSetup(inputs: FixedArray<bigint, 1>, vk: VerifyingKey): G1Point {
        let vk_x = vk.gammaAbc[0]
        for (let i = 0; i < G16BN256.N; i++) {
            const p = BN256.mulG1Point(vk.gammaAbc[i + 1], inputs[i])
            vk_x = BN256.addG1Points(vk_x, p)
        }
        return vk_x
    }

    @method()
    static verify(
        //inputs: FixedArray<bigint, G16BN256.N>,
        inputs: FixedArray<bigint, 1>,
        proof: Proof,
        vk: VerifyingKey
    ): boolean {
        const vk_x = G16BN256.vkXSetup(inputs, vk)

        const a0: G1Point = {
            x: proof.a.x,
            y: -proof.a.y,
        }
        return BN256Pairing.pairCheckP4Precalc(
            a0,
            proof.b,
            vk.millerb1a1,
            vk_x,
            vk.gamma,
            proof.c,
            vk.delta
        )
    }
}
