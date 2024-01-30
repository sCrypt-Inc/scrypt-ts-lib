import {
    ByteString,
    byteString2Int,
    method,
    PubKey,
    reverseByteString,
    sha256,
    SmartContractLib,
    toByteString,
    slice,
} from 'scrypt-ts'
import { Point } from './ec/misc'
import { SECP256K1 } from './ec/secp256k1'

// Schnorr signatures verification for secp256k1
export class Schnorr extends SmartContractLib {
    // s * G = R + hash(r, P, m) * P
    @method()
    static verify(
        sig: ByteString,
        pubKey: PubKey,
        msg: ByteString,
        R: Point
    ): boolean {
        const r: ByteString = slice(sig, 0n, 32n) // First 32 bytes
        const s = byteString2Int(
            reverseByteString(slice(sig, 32n, 64n), 32n) + toByteString('00')
        )

        // e = Hash(r || P || msg)
        let e = byteString2Int(
            reverseByteString(sha256(r + pubKey + msg), 32n) +
                toByteString('00')
        )
        e = SECP256K1.modReduce(e, SECP256K1.n)

        // E = e * P
        const P = SECP256K1.pubKey2Point(pubKey)
        const E = SECP256K1.mulByScalar(P, e)

        // A = R + E
        const A = SECP256K1.addPoints(R, E)

        // S = s * G
        const S = SECP256K1.mulGeneratorByScalar(s)

        // S == A
        return SECP256K1.comparePoints(S, A)
    }
}
