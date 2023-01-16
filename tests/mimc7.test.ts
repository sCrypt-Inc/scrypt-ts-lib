import { expect } from "chai";
import { buildMimc7 } from 'circomlibjs'
import { Mimc7 } from '../src/hash/mimc7';
import { method, assert, SmartContract } from 'scrypt-ts';

class Mimc7Test extends SmartContract {
  @method()
  public unlock(x: bigint, k: bigint, h: bigint) {
    assert(Mimc7.hash(x, k) === h);
  }
}

const getRandomInt = (min: number, max: number) => BigInt(Math.floor(Math.random() * (max - min) + min + 1))

describe("Test Mimc7", () => {
  let mimc7_js_version;

  before(async () => {
    await Mimc7Test.compile()
    mimc7_js_version = await buildMimc7()
  })

  it("should pass test", () => {
    const mimc7Test = new Mimc7Test()
    for (let i = 0; i < 10; i++) {
      let x = getRandomInt(-9999999999, 9999999999)
      let k = getRandomInt(1, 9999999999)
      let h = BigInt(mimc7_js_version.F.toString(mimc7_js_version.hash(x, k)))
      const result = mimc7Test.verify(self => {
        self.unlock(x, k, h)
      })
      expect(result.success, result.error).to.be.true
    }
  })
})

