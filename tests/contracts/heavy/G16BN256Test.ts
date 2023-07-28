import { G16BN256, Proof, VerifyingKey } from '../../../src/zk/g16bn256'

import { method, assert, SmartContract, FixedArray } from 'scrypt-ts'

export class G16BN256Test extends SmartContract {
    @method()
    public verifyProof(
        inputs: FixedArray<bigint, 1>,
        proof: Proof,
        vk: VerifyingKey
    ) {
        assert(G16BN256.verify(inputs, proof, vk))
    }
}
