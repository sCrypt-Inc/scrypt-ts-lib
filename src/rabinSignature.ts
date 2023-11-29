import {
    ByteString,
    method,
    sha256,
    SmartContractLib,
    Utils,
    slice,
    toByteString,
} from 'scrypt-ts'
import { toRabinSig, deserialize } from 'rabinsig'

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
        let result = RabinVerifier.expandHash(x)
        for (let i = 0; i < RabinVerifier.SECURITY_LEVEL - 1; i++) {
            result += RabinVerifier.expandHash(result)
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

/**
 * Rabin signature verifier for WitnessOnChain.
 * @see {@link https://api.witnessonchain.com }
 */
export class WitnessOnChainVerifier extends SmartContractLib {
    @method()
    static verifySig(
        msg: ByteString,
        sig: RabinSig,
        pubKey: RabinPubKey
    ): boolean {
        return RabinVerifier.verifySig(msg, sig, pubKey)
    }

    static parseMsg(response: { data: string }): ByteString {
        return toByteString(response.data)
    }

    static parsePubKey(response: { publicKey: string }): RabinPubKey {
        return Utils.fromLEUnsigned(response.publicKey + '00')
    }

    static parseSig(response: {
        signature: { s: string; padding: string }
    }): RabinSig {
        return toRabinSig(deserialize(response.signature))
    }
}
