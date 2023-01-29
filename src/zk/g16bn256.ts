import { SmartContractLib, method, FixedArray } from 'scrypt-ts'
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
    @method()
    static verify(
        inputs: FixedArray<bigint, 1>, // TODO: Make size adjustable by lib user.
        proof: Proof,
        vk: VerifyingKey
    ): boolean {
        let vk_x = vk.gammaAbc[0]
        for (let i = 0; i < 1; i++) {
            const p = BN256.mulG1Point(vk.gammaAbc[i + 1], inputs[i])
            vk_x = BN256.addG1Points(vk_x, p)
        }

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
