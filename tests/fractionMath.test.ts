import { expect } from 'chai'
import { method, assert, SmartContract, ByteString } from 'scrypt-ts'
import { Fraction, FRMath } from '../src/fractionMath'

class FRMathTest extends SmartContract {
    @method()
    runOp(op: bigint, x: Fraction, y: Fraction): Fraction {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (op == 0n) {
            r = FRMath.add(x, y)
        } else if (op == 1n) {
            r = FRMath.sub(x, y)
        } else if (op == 2n) {
            r = FRMath.mul(x, y)
        } else if (op == 3n) {
            r = FRMath.div(x, y)
        } else if (op == 4n) {
            r = FRMath.abs(x)
        }
        return r
    }

    @method()
    runSafeOp(op: bigint, x: Fraction, y: Fraction): Fraction {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (op == 0n) {
            r = FRMath.sAdd(x, y)
        } else if (op == 1n) {
            r = FRMath.sSub(x, y)
        } else if (op == 2n) {
            r = FRMath.sMul(x, y)
        } else if (op == 3n) {
            r = FRMath.sDiv(x, y)
        } else if (op == 4n) {
            r = FRMath.sAbs(x)
        }
        return r
    }

    @method()
    public unlock(
        x: Fraction,
        y: Fraction,
        z: Fraction,
        op: bigint,
        strict: boolean
    ) {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (strict) {
            r = this.runSafeOp(op, x, y)
            assert(FRMath.sEqual(r, z))
        } else {
            r = this.runOp(op, x, y)
            assert(FRMath.equal(r, z))
        }
        assert(true)
    }

    @method()
    public unlockScaled(
        s: bigint,
        x: Fraction,
        y: Fraction,
        op: bigint,
        strict: boolean,
        sr: bigint
    ) {
        let r: Fraction = {
            n: 0n,
            d: 1n,
        }
        if (strict) {
            r = this.runSafeOp(op, x, y)
            assert(FRMath.scaleUp(r, s) == sr)
        } else {
            r = this.runOp(op, x, y)
            assert(FRMath.scaleUp(r, s) == sr)
        }
        assert(true)
    }
}

const [ADD, SUB, MUL, DIV, ABS] = [0, 1, 2, 3, 4]

describe('Test Fractional Math', () => {
    let frm, result
    let x: Fraction
    let y: Fraction
    let nan: Fraction

    before(async () => {
        await FRMathTest.compile()
        frm = new FRMathTest()

        nan = {
            n: 0n,
            d: 0n,
        } // not a number
    })

    describe('in normal mode', () => {
        it('should add 1/3 with 1/4 correctly', () => {
            x = { n: 1n, d: 3n }
            y = { n: 1n, d: 4n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 7n, d: 12n }, ADD, false)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 70n, d: 120n }, ADD, false)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 5n, d: 12n }, ADD, false)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, ADD, false, 58n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, ADD, false, 583n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should sub 5n/10n with 1n/10n correctly', () => {
            x = { n: 5n, d: 10n }
            y = { n: 1n, d: 10n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 40n, d: 100n }, SUB, false)
            })
            expect(result.success, result.error).to.be.true

            // reduction result is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 2n, d: 5n }, SUB, false)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 10n }, SUB, false)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, SUB, false, 40n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, SUB, false, 400n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should mul 1n/100n with 200n correctly', () => {
            x = { n: 1n, d: 100n }
            y = { n: 200n, d: 1n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 200n, d: 100n }, MUL, false)
            })
            expect(result.success, result.error).to.be.true

            // reduction result is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 2n, d: 1n }, MUL, false)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 100n, d: 200n }, MUL, false)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, MUL, false, 200n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, MUL, false, 2000n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should div 5n/6n with 9n/10n correctly', () => {
            x = { n: 5n, d: 6n }
            y = { n: 9n, d: 10n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 50n, d: 54n }, DIV, false)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 25n, d: 27n }, DIV, false)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 4n }, DIV, false)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, DIV, false, 92n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, DIV, false, 925n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should not throw when div 1n with 0n', () => {
            x = { n: 1n, d: 1n }
            y = { n: 0n, d: 10n }

            result = frm.verify((self) => {
                self.unlock(x, y, nan, DIV, false)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should abs -1n/3n correctly', () => {
            x = { n: -1n, d: 3n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, nan, { n: 1n, d: 3n }, ABS, false)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, nan, { n: 10n, d: 30n }, ABS, false)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: -1n, d: 3n }, ABS, false)
                })
            }).to.throw(/Execution failed/)
        })

        it('should not throw even if denominator is not positive', () => {
            x = { n: 3n, d: -4n }
            y = { n: 1n, d: -4n }

            result = frm.verify((self) => {
                self.unlock(x, y, { n: -4n, d: 4n }, ADD, false)
            })
            expect(result.success, result.error).to.be.true

            result = frm.verify((self) => {
                self.unlock(x, y, { n: -2n, d: 4n }, SUB, false)
            })
            expect(result.success, result.error).to.be.true

            result = frm.verify((self) => {
                self.unlock(x, y, { n: 3n, d: 16n }, MUL, false)
            })
            expect(result.success, result.error).to.be.true

            result = frm.verify((self) => {
                self.unlock(x, y, { n: 12n, d: 4n }, DIV, false)
            })
            expect(result.success, result.error).to.be.true

            result = frm.verify((self) => {
                self.unlock(x, y, { n: 3n, d: 4n }, ABS, false)
            })
            expect(result.success, result.error).to.be.true
        })
    })

    describe('in safe mode', () => {
        it('should add 1n/3n with 1n/4n correctly', () => {
            x = { n: 1n, d: 3n }
            y = { n: 1n, d: 4n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 7n, d: 12n }, ADD, true)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 70n, d: 120n }, ADD, true)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 5n, d: 12n }, ADD, true)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, ADD, true, 58n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, ADD, true, 583n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should sub 5n/10n with 1n/10n correctly', () => {
            x = { n: 5n, d: 10n }
            y = { n: 1n, d: 10n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 40n, d: 100n }, SUB, true)
            })
            expect(result.success, result.error).to.be.true

            // reduction result is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 2n, d: 5n }, SUB, true)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 10n }, SUB, true)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, SUB, true, 40n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, SUB, true, 400n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should mul 1n/100n with 200n correctly', () => {
            x = { n: 1n, d: 100n }
            y = { n: 200n, d: 1n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 200n, d: 100n }, MUL, true)
            })
            expect(result.success, result.error).to.be.true

            // reduction result is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 2n, d: 1n }, MUL, true)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 100n, d: 200n }, MUL, true)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, MUL, true, 200n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, MUL, true, 2000n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should div 5n/6n with 9n/10n correctly', () => {
            x = { n: 5n, d: 6n }
            y = { n: 9n, d: 10n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 50n, d: 54n }, DIV, true)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, y, { n: 25n, d: 27n }, DIV, true)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 4n }, DIV, true)
                })
            }).to.throw(/Execution failed/)

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(100n, x, y, DIV, true, 92n)
            })
            expect(result.success, result.error).to.be.true

            // scaled-up result
            result = frm.verify((self) => {
                self.unlockScaled(1000n, x, y, DIV, true, 925n)
            })
            expect(result.success, result.error).to.be.true
        })

        it('should throw when div 1n with 0n', () => {
            x = { n: 1n, d: 1n }
            y = { n: 0n, d: 10n }

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, nan, DIV, true)
                })
            }).to.throw(/Execution failed/)
        })

        it('should abs -1n/3n correctly', () => {
            x = { n: -1n, d: 3n }

            // correct result
            result = frm.verify((self) => {
                self.unlock(x, nan, { n: 1n, d: 3n }, ABS, true)
            })
            expect(result.success, result.error).to.be.true

            // same result with different d is also correct
            result = frm.verify((self) => {
                self.unlock(x, nan, { n: 10n, d: 30n }, ABS, true)
            })
            expect(result.success, result.error).to.be.true

            // wrong result
            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: -1n, d: 3n }, ABS, true)
                })
            }).to.throw(/Execution failed/)
        })

        it('should throw if denominator is not positive', () => {
            x = { n: 3n, d: -4n }
            y = { n: 1n, d: -4n }

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: -4n, d: 4n }, ADD, true)
                })
            }).to.throw(/Execution failed/)

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: -2n, d: 4n }, SUB, true)
                })
            }).to.throw(/Execution failed/)

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 16n }, MUL, true)
                })
            }).to.throw(/Execution failed/)

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 12n, d: 4n }, DIV, true)
                })
            }).to.throw(/Execution failed/)

            expect(() => {
                frm.verify((self) => {
                    self.unlock(x, y, { n: 3n, d: 4n }, ABS, true)
                })
            }).to.throw(/Execution failed/)
        })
    })
})
