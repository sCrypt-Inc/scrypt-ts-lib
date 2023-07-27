import { expect } from 'chai'
import { buildMimc7 } from 'circomlibjs'
import { Mimc7Test } from './contracts/mimc7'

const getRandomInt = (min: number, max: number) =>
    BigInt(Math.floor(Math.random() * (max - min) + min + 1))

describe('Test Mimc7', () => {
    let mimc7_js_version

    before(async () => {
        await Mimc7Test.compile()
        mimc7_js_version = await buildMimc7()
    })

    it('should pass test', () => {
        const mimc7Test = new Mimc7Test()
        for (let i = 0; i < 10; i++) {
            const x = getRandomInt(-9999999999, 9999999999)
            const k = getRandomInt(1, 9999999999)
            const h = BigInt(
                mimc7_js_version.F.toString(mimc7_js_version.hash(x, k))
            )
            const result = mimc7Test.verify((self) => {
                self.unlock(x, k, h)
            })
            expect(result.success, result.error).to.be.true
        }
    })
})
