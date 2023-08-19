import { expect } from 'chai'
import { RabinSig } from '../scrypt-ts-lib'
import { ByteString, byteString2Int } from 'scrypt-ts'

import { generatePrivKey, privKeyToPubKey, sign } from 'rabinsig'
import { RabinVerifierTest } from '../contracts/rabinSignature'

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

    it('should pass w correct signature from witnessonchain', () => {
        const WOC_DATA = {
            digest: 'f1d32f640c76050000000000044253565f555344430000000000000000',
            rate: 35.79,
            signatures: {
                rabin: {
                    padding: '00000000',
                    public_key:
                        'ad7e1e8d6d2960129c9fe6b636ef4041037f599c807ecd5adf491ce45835344b18fd4e7c92fd63bb822b221344fe21c0522ab81e9f8e848206875370cae4d908ac2656192ad6910ebb685036573b442ec1cff490c1638b7f5a181ae6d6bc9a04a305720559c893611f836321c2beb69dbf3694b9305a988c77e0a451c38674e84ce95a912833d2cf4ca9d48cc76d8250d0130740145ca19e20b1513bb93ca7665c1f110493d1b5aa344702109df5feca790f988eaa02f92e019721ae0e8bfaa9fdcd3401ffb4433fbe6e575ed9f704a6dc60872f0d23b2f43bfe5e64ce0fbc71283e6dedee79e20ad878917fa4a8257f879527c58f89a8670be591fc2815f7e7a8d74a9830788404f66170058dd7a08f47c4954324088dbed2f330015ccc36d29efd392a3cd5bf9835871f6b4b203c228af16f5b461676ce8e51003afd3137978117cf41147f2bb615a7c338bebdca5f81a43fe9b51480ae52ce04cf2f2b1714599fe09ae8401e0e155b4caa89fb37b00c604517fc36961f84901a73a343bb40',
                    signature:
                        '85c7577eb669254e8faf1e05ac173f76493d5a575e71da1eeb3968cd176b7dbaa31f605983da189bd71ebc985eaee112cead64de773aeada75abcc0e746b0646b3e92c791c48086348c34cc01f3cb7b120a405326696f64d8b8e2afed7c5adea6d33938175b249ae729a6e436bc7ab9eda27c325bd199611a0389aca788a0013bbd7df00cb5975af08e93847357026383e611e458c392f2471c3b5c50794d68ff6e94a6cba5736e24972bd66747af61b4a50c361c9a2ccb83e96ef961d3b1711cf458091d2ec1a03ca185ae4d99279e71323303f923fa4ecf6e21178bab757fff9a5c08dad2f95bfcf1c3df0324e97f948d0d98d56f5018ffbea5dfa1510a6e659197831e6f6697d4579ca19a208ba15fee4abf21cf588f74a14786a6bb8ef187bd29942a10dd42cdcd6f63682a2ebfef5a9bb73b58f14753a1919b84d3a0c13b883dda4213d545eac7182e9f54b4e4e0fe1ac403ec832eb0e8512fdc114e5e6070d52f12785db42f657fb6216ab065f11bee63e0a5e07136db821c694c17103',
                },
            },
            symbol: 'BSV_USDC',
            timestamp: 1680856049,
        }

        const nRabin = byteString2Int(
            WOC_DATA.signatures.rabin.public_key + '00'
        )

        const s = byteString2Int(WOC_DATA.signatures.rabin.signature + '00')

        const sig: RabinSig = {
            s: s,
            padding: WOC_DATA.signatures.rabin.padding,
        }

        const result = rabinVerifierTest.verify((self) => {
            self.verifySigWOC(WOC_DATA.digest, sig, nRabin, true)
        })
        expect(result.success, result.error).to.be.true
    })
})
