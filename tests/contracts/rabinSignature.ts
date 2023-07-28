import {
    RabinVerifier,
    RabinSig,
    RabinPubKey,
    RabinVerifierWOC,
} from '../../src/rabinSignature'

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
    public verifySigWOC(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey,
        res: boolean
    ) {
        assert(RabinVerifierWOC.verifySig(msg, sig, pubKey) == res)
    }
}
