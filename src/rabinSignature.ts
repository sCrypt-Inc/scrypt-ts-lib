import { ByteString, method, sha256, SmartContractLib, Utils } from 'scrypt-ts'

export type RabinPubKey = bigint

// Rabin signature is combination (S, U).
export type RabinSig = {
    // S
    s: bigint
    // U
    padding: ByteString
}

export class RabinVerifier extends SmartContractLib {
    @method()
    static hash(x: ByteString): ByteString {
        // expand into 512 bit hash
        const hx = sha256(x)
        return sha256(hx.slice(0, 32)) + sha256(hx.slice(32, 64))
    }

    @method()
    static verifySig(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey
    ): boolean {
        const h = Utils.fromLEUnsigned(RabinVerifier.hash(msg + sig.padding))
        return (sig.s * sig.s) % pubKey == h % pubKey
    }
}

export class RabinVerifierWOC extends SmartContractLib {
    // Rabin signature verifier for WitnessOnChain.
    // https://witnessonchain.com

    @method()
    static hash(x: ByteString): ByteString {
        // expand into 3072 bit hash
        let hx: ByteString = sha256(x)
        for (let i = 0; i < 11; i++) {
            hx += sha256(hx)
        }
        return hx
    }

    @method()
    static verifySig(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey
    ): boolean {
        const h = Utils.fromLEUnsigned(RabinVerifierWOC.hash(msg + sig.padding))
        return (sig.s * sig.s) % pubKey == h % pubKey
    }
}
