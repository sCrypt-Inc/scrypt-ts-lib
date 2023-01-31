import { expect } from 'chai'
import { SECP256R1 } from '../src/ec/secp256r1'
import {
    method,
    assert,
    SmartContract,
    ByteString,
    toByteString,
} from 'scrypt-ts'

import { Point, Signature } from '../src/ec/misc'

class SECP256R1Test extends SmartContract {
    @method()
    public modReduce(x: bigint, m: bigint, res: bigint) {
        assert(SECP256R1.modReduce(x, m) == res)
    }

    @method()
    public addPoints(a: Point, b: Point, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.addPoints(a, b), res))
    }

    @method()
    public doublePoint(a: Point, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.doublePoint(a), res))
    }

    @method()
    public mulByScalar(a: Point, scalar: bigint, res: Point) {
        assert(SECP256R1.comparePoints(SECP256R1.mulByScalar(a, scalar), res))
    }

    //@method()
    //public mulGeneratorByScalar(scalar: bigint, res: Point) {
    //    assert(SECP256R1.comparePoints(SECP256R1.mulGeneratorByScalar(scalar), res))
    //}

    //@method()
    //public verifySig(
    //    data: ByteString,
    //    sig: Signature,
    //    pubKey: Point,
    //    res: boolean
    //) {
    //    assert(SECP256R1.verifySig(data, sig, pubKey) == res)
    //}
}

describe('Test SECP256R1 curve', () => {
    let secp256k1test = undefined

    before(async () => {
        await SECP256R1Test.compile()
        secp256k1test = new SECP256R1Test()
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
            x: 68935837542910441562692596222934527144457418832541333833480317674433941835814n,
            y: 68869163652622879126493753345209308199062577934465214654685722903888322215150n,
        }
        const b: Point = {
            x: 61528180511941688140627296232889832282183750559209454797614656211724247640706n,
            y: 99941986815681612457598882465438046423730693948527713862804442583119513860069n,
        }
        const res: Point = {
            x: 45442860601585373300656980808771578074015825225338135126248406565585473592891n,
            y: 14206121699813364072381356634311010472955982143341985932092892403746568794750n,
        }
        const result = secp256k1test.verify((self) => {
            self.addPoints(a, b, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass doublePoint', () => {
        const a: Point = {
            x: 52464998847287996901652484886880367692391980767476620432684196559253029206068n,
            y: 95827065475533932120071139471805203073176051172172811796117648862900499258695n,
        }
        const res: Point = {
            x: 102585576921063978330892642267578496408341490071860800838390673715146385009854n,
            y: 98586878564085763479778344249576711212972957183012904638970110705578433793036n,
        }
        const result = secp256k1test.verify((self) => {
            self.doublePoint(a, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass mulByScalar', () => {
        const a: Point = {
            x: 9331976947469657177513214360853721922585811266519144022577445599576723848584n,
            y: 56207287798309866773270072511978844591097714149515262090625357530550660767458n,
        }
        const scalar =
            105243871952419139315485076786514164315826955267678199054826111568971612580402n
        const res: Point = {
            x: 98420798828903144302960760783069028977376916903481405595276147860168864892615n,
            y: 31540254452726665469851843650865214453257424757542837221430977253438671565220n,
        }
        const result = secp256k1test.verify((self) => {
            self.mulByScalar(a, scalar, res)
        })
        expect(result.success, result.error).to.be.true
    })

    //it('should pass mulGeneratorByScalar', () => {
    //    const scalar = 42109386089949602923027552840771321377424265038253004646151746506007960784117n
    //    const res: Point = {
    //        x: 28443150123515232814844709315923209175832628145571296565513283258006772229730n,
    //        y: 51114096444803956509532026520592273725426220781201112639269749184509778144373n,
    //    }
    //    const result = secp256k1test.verify((self) => {
    //        self.mulGeneratorByScalar(scalar, res)
    //    })
    //    expect(result.success, result.error).to.be.true
    //})

    //it('should pass verifySig', () => {
    //    const sig: Signature = {
    //        r: 103008526977055580769878707005861355896836282185244080419270302085182966345575n,
    //        s: 74732669050327306809812083832060425584323861303688425547351160250457167807857n,
    //    }
    //    const data = toByteString('3031323334353637383930313233343536373839303132333435363738393132')
    //    const pubKey: Point = {
    //        x: 29804352722577497140984840482578065216881301948347196128332561221631027762608n,
    //        y: 55207735028932990506849077331206753512748620777006367755992841652478289887660n,
    //    }
    //    const result = secp256k1test.verify((self) => {
    //        self.verifySig(data, sig, pubKey, true)
    //    })
    //    expect(result.success, result.error).to.be.true
    //})
})
