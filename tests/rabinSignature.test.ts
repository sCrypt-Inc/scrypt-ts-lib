import { expect } from 'chai'
import { RabinVerifier, RabinSig, RabinPubKey } from '../src/rabinSignature'
import {
    method,
    assert,
    SmartContract,
    ByteString,
    toByteString,
} from 'scrypt-ts'

import { generatePrivKey, privKeyToPubKey, sign } from 'rabinsig'

class RabinVerifierTest extends SmartContract {
    @method()
    public verifySig(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey,
        res: boolean
    ) {
        assert(RabinVerifier.verifySig(msg, sig, pubKey) == res)
    }
}

describe('Test Rabin Signature', () => {
    let rabinVerifierTest

    const msg: ByteString = '00112233445566778899aabbccddeeff'

    before(async () => {
        await RabinVerifierTest.compile()
        rabinVerifierTest = new RabinVerifierTest()
    })

    it('should pass w correct signature', () => {
        const key = generatePrivKey()
        const nRabin = privKeyToPubKey(key.p, key.q)
        const signRes = sign(msg, key.p, key.q, nRabin)

        let paddingBytes: ByteString = ''

        for (let i = 0; i < signRes.paddingByteCount; i++) {
            paddingBytes += '00'
        }

        const sig: RabinSig = {
            s: signRes.signature,
            padding: paddingBytes,
        }

        const result = rabinVerifierTest.verify((self) => {
            self.verifySig(msg, sig, nRabin, true)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should fail w wrong padding', () => {
        const key = generatePrivKey()
        const nRabin = privKeyToPubKey(key.p, key.q)
        const signRes = sign(msg, key.p, key.q, nRabin)

        let paddingBytes: ByteString = ''

        for (let i = 0; i < signRes.paddingByteCount + 1; i++) {
            paddingBytes += '00'
        }

        const sig: RabinSig = {
            s: signRes.signature,
            padding: paddingBytes,
        }

        expect(() => {
            rabinVerifierTest.verify((self) => {
                self.verifySig(msg, sig, nRabin, true)
            })
        }).to.throw(/Execution failed/)
    })

    it('should fail w wrong signature', () => {
        const key = generatePrivKey()
        const nRabin = privKeyToPubKey(key.p, key.q)
        const signRes = sign(msg, key.p, key.q, nRabin)

        let paddingBytes: ByteString = ''

        for (let i = 0; i < signRes.paddingByteCount; i++) {
            paddingBytes += '00'
        }

        const sig: RabinSig = {
            s: signRes.signature - 1n,
            padding: paddingBytes,
        }

        expect(() => {
            rabinVerifierTest.verify((self) => {
                self.verifySig(msg, sig, nRabin, true)
            })
        }).to.throw(/Execution failed/)
    })
})
