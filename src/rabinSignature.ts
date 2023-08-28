import {
    ByteString,
    method,
    sha256,
    SmartContractLib,
    Utils,
    slice,
    toByteString,
} from 'scrypt-ts'

export type RabinPubKey = bigint

// Rabin signature is combination (S, U).
export type RabinSig = {
    // S
    s: bigint
    // U
    padding: ByteString
}

export class RabinVerifier extends SmartContractLib {
    static readonly SECURITY_LEVEL = 6

    @method()
    static expandHash(x: ByteString): ByteString {
        // expand into 512 bit hash
        const hx = sha256(x)
        return sha256(slice(hx, 0n, 16n)) + sha256(slice(hx, 16n))
    }

    @method()
    static hash(x: ByteString): ByteString {
        let result = toByteString('')
        for (let i = 0; i < RabinVerifier.SECURITY_LEVEL; i++) {
            if (i == 0) {
                result = RabinVerifier.expandHash(x)
            } else {
                result += RabinVerifier.expandHash(result)
            }
        }
        return result
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

    static parsePubKey(response: {
        rabin: { public_key: string }
    }): RabinPubKey {
        return Utils.fromLEUnsigned(response.rabin.public_key)
    }

    static parseSig(response: {
        rabin: { signature: { s: string; padding: string } }
    }): RabinSig {
        return {
            s: Utils.fromLEUnsigned(response.rabin.signature.s),
            padding: response.rabin.signature.padding,
        }
    }
}
