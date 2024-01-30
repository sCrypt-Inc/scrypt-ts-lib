import { method, SmartContractLib, ByteString, slice } from 'scrypt-ts'

// A library that emulates an array interface on top of a ByteString.
export class ArrayUtils extends SmartContractLib {
    // Get the byte at the given index.
    @method()
    static getElemAt(b: ByteString, idx: bigint): ByteString {
        return slice(b, idx, idx + 1n)
    }

    // Set the byte at the given index.
    @method()
    static setElemAt(b: ByteString, idx: bigint, val: ByteString): ByteString {
        return slice(b, 0n, idx) + val + slice(b, idx + 1n)
    }
}
