import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)
import { bsv, PubKey, toByteString, toHex } from 'scrypt-ts'
import { SchnorrTest } from '../contracts/heavy/schnorr'

const G = bsv.crypto.Point.getG()
const N = bsv.crypto.Point.getN()

describe('Heavy: Test  contract "Schnorr"', () => {
    const pk = bsv.PrivateKey.fromRandom('testnet')
    const publicKey = new bsv.PublicKey(pk.publicKey.point, {
        compressed: false,
        network: 'testnet',
    })

    let X, sig, m, st, result

    before(async () => {
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

        await SchnorrTest.compile()

        X = {
            x: BigInt(R.getX().toString()),
            y: BigInt(R.getY().toString()),
        }

        st = new SchnorrTest()
    })

    it('should call unlock successfully', () => {
        const result = st.verify((self) => {
            self.test(toHex(sig), PubKey(toHex(publicKey)), toHex(m), X, true)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should fail w invalid publicKeyX', () => {
        const wrongPk = bsv.PrivateKey.fromRandom('testnet')
        const wrongPublicKey = new bsv.PublicKey(wrongPk.publicKey.point, {
            compressed: false,
            network: 'testnet',
        })

        const result = st.verify((self) => {
            self.test(
                toHex(sig),
                PubKey(toHex(wrongPublicKey)),
                toHex(m),
                X,
                false
            )
        })
        expect(result.success, result.error).to.be.true
    })

    it('should fail w invalid message', () => {
        const result = st.verify((self) => {
            self.test(
                toHex(sig),
                PubKey(toHex(publicKey)),
                toHex(m) + toByteString('11'),
                X,
                false
            )
        })
    })

    it('should fail w invalid sig', () => {
        const wrongSig = Buffer.concat([
            Buffer.from(
                '1111113c7c06fb73bc019fc657aaa3f4e48287649fb9fff8bb54b148d9b8fe9a',
                'hex'
            ),
            Buffer.from(
                '000000953a35e8424a7f2afdcefcae68130d3e19884fce8bb802b9cc6b9776d6',
                'hex'
            ),
        ])

        const result = st.verify((self) => {
            self.test(
                toHex(wrongSig),
                PubKey(toHex(publicKey)),
                toHex(m),
                X,
                false
            )
        })
    })
})
