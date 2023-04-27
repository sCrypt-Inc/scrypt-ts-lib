import { expect } from 'chai'
import * as elliptic from 'elliptic'
import {
    assert,
    bsv,
    ByteString,
    method,
    PubKey,
    Sig,
    SmartContract,
    toHex,
} from 'scrypt-ts'
import { Point } from '../src/ec/misc'
import { Schnorr } from '../src/schnorr'

const EC = elliptic.ec
const ec = new EC('secp256k1')

const p = ec.curve.p
const G = bsv.crypto.Point.getG()
const N = bsv.crypto.Point.getN()

class SchnorrTest extends SmartContract {
    @method()
    public test(
        sig: Sig,
        pubKey: PubKey,
        msg: ByteString,
        R: Point,
        res: boolean
    ) {
        assert(Schnorr.verify(sig, pubKey, msg, R) == res)
    }
}

describe('Heavy: Test  contract "Schnorr"', () => {
    const pk = bsv.PrivateKey.fromRandom('testnet')
    const publicKey = new bsv.PublicKey(pk.publicKey, {
        compressed: false,
        network: 'testnet',
    })

    let X, sig, m, st, result

    before(() => {
        m = Buffer.from('test schnorr BitcoinSV')

        const sha256Data = bsv.crypto.Hash.sha256(m)
        const r = bsv.PrivateKey.fromBuffer(sha256Data.reverse(), 'testnet')
        const rBN = r.toBigNumber()

        // R = r × G
        const R = G.mul(rBN)

        //s = r + hash(r, P, m) ⋅ pk
        const rPmHash = bsv.crypto.Hash.sha256(
            Buffer.concat([
                Buffer.from(rBN.toBuffer().reverse(), 'hex'),
                Buffer.from(toHex(publicKey), 'hex'),
                m,
            ])
        )
        const rPmBig = bsv.crypto.BN.fromBuffer(rPmHash)

        //s = r + hash(r, P, m) ⋅ pk
        const s = rBN.add(rPmBig.mul(pk.toBigNumber())).mod(N)

        sig = Buffer.concat([
            Buffer.from(rBN.toBuffer().reverse(), 'hex'),
            Buffer.from(s.toBuffer(), 'hex'),
        ])

        SchnorrTest.compile()

        X = {
            x: BigInt(R.getX().toString()),
            y: BigInt(R.getY().toString()),
        }

        st = new SchnorrTest()
    })
})
