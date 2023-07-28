import { Shift10 } from '../../src/shift10'
import { method, assert, SmartContract } from 'scrypt-ts'

export class Shift10Test extends SmartContract {
    @method()
    public unlock(x: bigint, n: bigint, op: bigint, expected: bigint) {
        let result = 0n
        if (op == 0n) {
            result = Shift10.pow(n)
        } else if (op == 1n) {
            result = Shift10.left(x, n)
        } else if (op == 2n) {
            result = Shift10.right(x, n)
        }

        assert(result == expected)
    }
}
