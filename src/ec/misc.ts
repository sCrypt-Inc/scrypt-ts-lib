import { SmartContractLib, method } from 'scrypt-ts'

export type Point = {
    x: bigint
    y: bigint
}

export type Signature = {
    r: bigint
    s: bigint
}

export class Tmp extends SmartContractLib {
    @method()
    static tmp(p: Point, sig: Signature): bigint {
        return 0n
    }
}
