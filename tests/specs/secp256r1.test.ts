import { expect } from 'chai'
import { Point, Signature } from '../scrypt-ts-lib'
import { SECP256R1Test } from '../contracts/heavy/secp256r1'

describe('Heavy: Test SECP256R1 curve', () => {
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

    it('should pass modInverseBranchlessP', () => {
        const result = secp256k1test.verify((self) => {
            self.modInverseBranchlessP(
                40802486451600066635175967658552075212978434774817548508148599457490600604882n,
                73262351829801099804208169817399223549782698313656863193450516152169854881764n
            )
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass modInverseBranchlessN', () => {
        const result = secp256k1test.verify((self) => {
            self.modInverseBranchlessN(
                112012499446190622784939685972077043133660998172726491381612386456067095620645n,
                42241626791187032938017876722529433903127673708814335768640856847432533930276n
            )
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

    it('should pass mulGeneratorByScalar', () => {
        const scalar =
            42109386089949602923027552840771321377424265038253004646151746506007960784117n
        const res: Point = {
            x: 28443150123515232814844709315923209175832628145571296565513283258006772229730n,
            y: 51114096444803956509532026520592273725426220781201112639269749184509778144373n,
        }
        const result = secp256k1test.verify((self) => {
            self.mulGeneratorByScalar(scalar, res)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass verifySig', () => {
        const sig: Signature = {
            r: 15689690539660918387412104111702945490749343920374328062968298895183618966869n,
            s: 99640955866492071400668323925677797144522837807923692112707154618646307984348n,
        }
        const data =
            21797938705943676250364201203381343399167106211923824075541142215201130098994n
        const pubKey: Point = {
            x: 111588339727759101196927904647949293715017143087847122951040559135872845700759n,
            y: 107198149497993853428046426044857056324132067226868984514169768422074768792003n,
        }
        const result = secp256k1test.verify((self) => {
            self.verifySig(data, sig, pubKey, true)
        })
        expect(result.success, result.error).to.be.true
    })
})
