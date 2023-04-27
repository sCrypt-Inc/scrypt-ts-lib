import {
    assert,
    ByteString,
    byteString2Int,
    method,
    PubKey,
    reverseByteString,
    sha256,
    Sig,
    SmartContractLib,
    toByteString,
    Utils,
} from 'scrypt-ts'
import { Point } from './ec/misc'
import { SECP256K1 } from './ec/secp256k1'

// Schnorr signatures verification for secp256k1
export class Schnorr extends SmartContractLib {
    // Convert a public key to a point, assuming it's uncompressed.
    @method()
    static pubKey2Point(pubKey: PubKey): Point {
        assert(
            pubKey.slice(0, 2) == toByteString('04'),
            'Pub key isn\'t prefixed with "04"'
        )
        // Convert signed little endian to unsigned big endian.
        const x = Utils.fromLEUnsigned(
            reverseByteString(pubKey.slice(2, 66), 32)
        )
        const y = Utils.fromLEUnsigned(
            reverseByteString(pubKey.slice(66, 130), 32)
        )
        return {
            x: x,
            y: y,
        }
    }

    // s * G = R + hash(r, P, m) * P
    @method()
    static verify(
        sig: Sig,
        pubKey: PubKey,
        msg: ByteString,
        R: Point
    ): boolean {
        const r: ByteString = sig.slice(0, 64) // First 32 bytes
        const s = byteString2Int(
            reverseByteString(sig.slice(64, 128), 32) + toByteString('00')
        )

        // e = Hash(r || P || msg)
        let e = byteString2Int(
            reverseByteString(sha256(r + pubKey + msg), 32) + toByteString('00')
        )
        e = SECP256K1.modReduce(e, SECP256K1.n)

        // E = e * P
        const P = Schnorr.pubKey2Point(pubKey)
        const E = SECP256K1.mulByScalar(P, e)

        // A = R + E
        const A = SECP256K1.addPoints(R, E)

        // S = s * G
        const S = SECP256K1.mulGeneratorByScalar(s)

        // S == A
        return SECP256K1.comparePoints(S, A)
    }
}
