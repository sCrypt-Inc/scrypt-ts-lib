import { expect } from 'chai'
import { WitnessOnChainVerifier } from '../scrypt-ts-lib'
import { ByteString } from 'scrypt-ts'

import { Rabin, toRabinSig } from 'rabinsig'
import { RabinVerifierTest } from '../contracts/rabinSignature'

describe('Test Rabin Signature', () => {
    const msg: ByteString = '00112233445566778899aabbccddeeff'

    const rabin = new Rabin()
    const privateKey = rabin.generatePrivKey()
    const publicKey = rabin.privKeyToPubKey(privateKey)
    const signature = rabin.sign(msg, privateKey)

    let rabinVerifierTest

    before(async () => {
        await RabinVerifierTest.compile()
        rabinVerifierTest = new RabinVerifierTest()
    })

    it('should pass w correct signature', () => {
        const result = rabinVerifierTest.verify((self) => {
            self.verifySig(msg, toRabinSig(signature), publicKey, true)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should fail w wrong padding', () => {
        const wrongSignature = Object.assign({}, signature, {
            paddingByteCount: signature.paddingByteCount + 1,
        })
        expect(() => {
            rabinVerifierTest.verify((self) => {
                self.verifySig(msg, toRabinSig(wrongSignature), publicKey, true)
            })
        }).to.throw(/Execution failed/)
    })

    it('should fail w wrong signature', () => {
        const wrongSignature = Object.assign({}, signature, {
            signature: signature.signature + 1n,
        })
        expect(() => {
            rabinVerifierTest.verify((self) => {
                self.verifySig(msg, toRabinSig(wrongSignature), publicKey, true)
            })
        }).to.throw(/Execution failed/)
    })

    it('should pass w correct signature from witnessonchain', () => {
        const WOC_KEY = {
            publicKey:
                'ad7e1e8d6d2960129c9fe6b636ef4041037f599c807ecd5adf491ce45835344b18fd4e7c92fd63bb822b221344fe21c0522ab81e9f8e848206875370cae4d908ac2656192ad6910ebb685036573b442ec1cff490c1638b7f5a181ae6d6bc9a04a305720559c893611f836321c2beb69dbf3694b9305a988c77e0a451c38674e84ce95a912833d2cf4ca9d48cc76d8250d0130740145ca19e20b1513bb93ca7665c1f110493d1b5aa344702109df5feca790f988eaa02f92e019721ae0e8bfaa9fdcd3401ffb4433fbe6e575ed9f704a6dc60872f0d23b2f43bfe5e64ce0fbc71283e6dedee79e20ad878917fa4a8257f879527c58f89a8670be591fc2815f7e7a8d74a9830788404f66170058dd7a08f47c4954324088dbed2f330015ccc36d29efd392a3cd5bf9835871f6b4b203c228af16f5b461676ce8e51003afd3137978117cf41147f2bb615a7c338bebdca5f81a43fe9b51480ae52ce04cf2f2b1714599fe09ae8401e0e155b4caa89fb37b00c604517fc36961f84901a73a343bb40',
        }
        const WOC_DATA = {
            timestamp: 1701230655,
            tradingPair: 'BSV-USDC',
            price: 469000,
            decimal: 4,
            data: '023fb866650828070000000000044253562d55534443',
            signature: {
                s: '4080a47af9afda06c8f7fc2c2e9ad504c4f2a189b899036a7c103968bf17f2f7e03bd90c3779a817ae2f087c0806e0d82ab89d2e328101777442ab2b72d3b8651f527cb8c6c60af0915296a489138c00b61d014ff77ac8684322bec69e362776cdafb0309d2d592789e1d079c292840a4276f4e1098b23ce184987048b9a23d2a992bb944b2f6b68e976174e502c9237353009f786695640867bfd962c77fe5397a373f3dd7948023378830a8f3fafb593c285a92f966bfa38da7dd5742089b37dee607e2e2e240251456c0c78b28e7ddb0a56ab19aa0f22b6f81567a2d3d340951c6ffbf97f0ac34de70d342a769b7f01007c28551f2c6c990b43e3d1a6d800501867ab1ba686188d2da692a3ca80e660f35eccbd7b713602b2b7686efe655177a88ea8e66b1663a5809a9a43078b0f5873284a731be75b719faa91c3453ed993bceebcfb0dc22e563293f8b42ada6326d3eb631aa33df65a397603314b8e25e07f9da4ab068f6b5a661221e2ed9b6d7b41ce351630d33ae80007da7f5a372f',
                padding: '00',
            },
        }
        const pubKey = WitnessOnChainVerifier.parsePubKey(WOC_KEY)
        const msg = WitnessOnChainVerifier.parseMsg(WOC_DATA)
        const sig = WitnessOnChainVerifier.parseSig(WOC_DATA)

        const result = rabinVerifierTest.verify((self) => {
            self.verifySigWitnessOnChain(msg, sig, pubKey, true)
        })
        expect(result.success, result.error).to.be.true
    })
})
