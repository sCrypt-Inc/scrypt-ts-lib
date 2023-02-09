import { expect } from 'chai'
import { SECP256K1 } from '../src/ec/secp256k1'
import {
    method,
    assert,
    SmartContract,
    toByteString,
    hash256,
    byteString2Int,
    reverseByteString,
} from 'scrypt-ts'

import { Point, Signature } from '../src/ec/misc'

class SECP256K1Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(SECP256K1.modReduce(x, m) == res)
    }

    @method()
    public addPoints(a: Point, b: Point, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.addPoints(a, b), res))
    }

    @method()
    public doublePoint(a: Point, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.doublePoint(a), res))
    }

    @method()
    public mulByScalar(a: Point, scalar: bigint, res: Point) {
        assert(SECP256K1.comparePoints(SECP256K1.mulByScalar(a, scalar), res))
    }

    @method()
    public verifySig(
        hashInt: bigint,
        sig: Signature,
        pubKey: Point,
        res: boolean
    ) {
        assert(SECP256K1.verifySig(hashInt, sig, pubKey) == res)
    }
}

describe('Test SECP256K1 curve', () => {
    let secp256k1test = undefined

    before(async () => {
        await SECP256K1Test.compile()
        secp256k1test = new SECP256K1Test()
    })

    it('should pass modReduce positive', () => {
        const result = secp256k1test.verify((self) => {
            self.modReduce(372193n, 3462n, 1759n)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass modReduce negative', () => {
        const result = secp256k1test.verify((self) => {
            self.modReduce(-3128731n, 324n, 137n)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass addPoints', () => {
        const a: Point = {
            x: 96083606928850442804351952269956287851642904173087542938027188922799479777185n,
            y: 75448263006761690254333067386986994360219006523830525384389838619706472013787n,
        }
        const b: Point = {
            x: 102940281165551785469285214549540447608784853591354910612010409609518722496768n,
            y: 109356155492959393949471982184931282830582050625056977543481099561419789011386n,
        }
        const res: Point = {
            x: 8879108468897347456765504195180429106657042111747195214479291905766592306780n,
            y: 103169758018221136051263071890208008719561264786165717141949776060180262669451n,
        }
        const result = secp256k1test.verify((self) => {
            self.addPoints(a, b, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass doublePoint', () => {
        const a: Point = {
            x: 96083606928850442804351952269956287851642904173087542938027188922799479777185n,
            y: 75448263006761690254333067386986994360219006523830525384389838619706472013787n,
        }
        const res: Point = {
            x: 57251121133466528381687333847398244109424921342037248564188960353587837427174n,
            y: 40883994999622267634940136474684226817206770737428544688339038642669647429872n,
        }
        const result = secp256k1test.verify((self) => {
            self.doublePoint(a, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass mulByScalar', () => {
        const a: Point = {
            x: 96083606928850442804351952269956287851642904173087542938027188922799479777185n,
            y: 75448263006761690254333067386986994360219006523830525384389838619706472013787n,
        }
        const scalar = 232322002564237870838323n
        const res: Point = {
            x: 30125787093159878952372401129982453045173291617606638848672722237603718479560n,
            y: 5605596387525170131533815803801663532660407547118800666264896783291498944118n,
        }
        const result = secp256k1test.verify((self) => {
            self.mulByScalar(a, scalar, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass verifySig', () => {
        const sig: Signature = {
            r: 116746015074693160840574783073143648642188140379205409343072632367266003056n,
            s: 54889175746748216520116204984872504778220436070200424770623145067226661913183n,
        }
        const data = toByteString('48656c6c6f2c20576f726c6421')

        // Hash message.
        const hash = hash256(data)

        const hashInt = byteString2Int(
            //reverseByteString(hash, 32) //.+(toByteString('00'))
            reverseByteString(hash, 32) + toByteString('00')
        )

        const pubKey: Point = {
            x: 96083606928850442804351952269956287851642904173087542938027188922799479777185n,
            y: 75448263006761690254333067386986994360219006523830525384389838619706472013787n,
        }
        const result = secp256k1test.verify((self) => {
            self.verifySig(hashInt, sig, pubKey, true)
        })
        expect(result.success, result.error).to.be.true
    })
})
