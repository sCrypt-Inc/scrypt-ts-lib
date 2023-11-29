import {
    RabinVerifier,
    RabinSig,
    RabinPubKey,
    WitnessOnChainVerifier,
} from '../scrypt-ts-lib'

import { method, assert, SmartContract, ByteString } from 'scrypt-ts'

export class RabinVerifierTest extends SmartContract {
    @method()
    public verifySig(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey,
        res: boolean
    ) {
        assert(RabinVerifier.verifySig(msg, sig, pubKey) == res)
    }

    @method()
    public verifySigWitnessOnChain(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey,
        res: boolean
    ) {
        assert(WitnessOnChainVerifier.verifySig(msg, sig, pubKey) == res)
    }
}
