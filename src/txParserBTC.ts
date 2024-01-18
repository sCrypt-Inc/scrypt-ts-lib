import {
    prop,
    method,
    SmartContractLib,
    FixedArray,
    assert,
    ByteString,
    toByteString,
    slice,
    Utils,
    fill,
} from 'scrypt-ts'

import { Output, Input } from './txParser'

export const MAX_BTC_TX_INPUT_COUNT = 5

export const MAX_BTC_TX_OUTPUT_COUNT = 5

export const MAX_WITNESS_ITEM_COUNT = 5

export class TxParserBTC extends SmartContractLib {
    @prop()
    buf: ByteString

    @prop()
    pos: bigint

    @prop()
    inputs: FixedArray<Input, typeof MAX_BTC_TX_INPUT_COUNT>

    @prop()
    outputs: FixedArray<Output, typeof MAX_BTC_TX_OUTPUT_COUNT>

    @prop()
    witness: FixedArray<
        FixedArray<ByteString, typeof MAX_WITNESS_ITEM_COUNT>,
        typeof MAX_BTC_TX_INPUT_COUNT
    >

    @prop()
    inputsCount: bigint

    @prop()
    outputsCount: bigint

    @prop()
    version: bigint

    @prop()
    nLockTime: bigint

    @prop()
    isWitness: boolean

    constructor(raw: ByteString) {
        super(raw)
        this.buf = raw
        this.pos = 0n
        this.inputsCount = 0n
        this.outputsCount = 0n
        this.version = 0n
        this.nLockTime = 0n
        this.isWitness = false
        this.inputs = fill(
            {
                txId: toByteString(''),
                vout: 0n,
                scriptSig: toByteString(''),
                nSequence: 1n,
            },
            MAX_BTC_TX_INPUT_COUNT
        )
        this.outputs = fill(
            { satoshis: 0n, script: toByteString('') },
            MAX_BTC_TX_OUTPUT_COUNT
        )
        this.witness = fill(
            fill(toByteString(''), MAX_WITNESS_ITEM_COUNT),
            MAX_BTC_TX_INPUT_COUNT
        )
    }

    @method()
    readVarInt(): bigint {
        const n: bigint = Utils.fromLEUnsigned(
            slice(this.buf, this.pos, this.pos + 1n)
        )
        this.pos++

        let ret = 0n

        if (n < 0xfdn) {
            ret = n
        } else if (n == 0xfdn) {
            ret = Utils.fromLEUnsigned(slice(this.buf, this.pos, this.pos + 2n))
            this.pos += 2n
        } else if (n == 0xfen) {
            ret = Utils.fromLEUnsigned(slice(this.buf, this.pos, this.pos + 4n))
            this.pos += 4n
        } else if (n == 0xffn) {
            ret = Utils.fromLEUnsigned(slice(this.buf, this.pos, this.pos + 8n))
            this.pos += 8n
        }

        return ret
    }

    @method()
    readBytes(l: bigint): ByteString {
        const ret = slice(this.buf, this.pos, this.pos + l)
        this.pos += l
        return ret
    }

    @method()
    readUInt32(): bigint {
        return Utils.fromLEUnsigned(this.readBytes(4n))
    }

    @method()
    tryReadFlag(): boolean {
        const flag = slice(this.buf, this.pos, this.pos + 2n)
        const ret = flag == toByteString('0001')
        if (ret) {
            this.pos += 2n
        }
        return ret
    }

    @method()
    readInput(): Input {
        // Previous Transaction hash, 32 bytes
        const txid: ByteString = this.readBytes(32n)
        // Previous Txout-index, 4 bytes
        const vout: bigint = Utils.fromLEUnsigned(this.readBytes(4n))
        // Txin-script length, 1 - 9 bytes
        const scriptSigLen: bigint = this.readVarInt()
        // Txin-script / scriptSig, 	<in-script length>-many bytes
        const scriptSig: ByteString =
            scriptSigLen > 0n ? this.readBytes(scriptSigLen) : toByteString('')
        // Sequence_no, 4 bytes
        const nSequence: bigint = Utils.fromLEUnsigned(this.readBytes(4n))
        return {
            txId: txid,
            vout: vout,
            scriptSig: scriptSig,
            nSequence: nSequence,
        }
    }

    @method()
    readOutput(): Output {
        // Satoshi value, 8 bytes
        const satoshis: bigint = Utils.fromLEUnsigned(this.readBytes(8n))
        // Txout-script length, 1 - 9 bytes
        const scriptLen: bigint = this.readVarInt()
        // Txout-script / scriptPubKey, <out-script length>-many bytes
        const script: ByteString = this.readBytes(scriptLen)
        return {
            script: script,
            satoshis: satoshis,
        }
    }

    @method()
    readWitness(): void {
        for (let i = 0; i < MAX_BTC_TX_INPUT_COUNT; i++) {
            if (i < this.inputsCount) {
                const n = this.readVarInt()
                if (n > 0n) {
                    for (let j = 0; j < MAX_WITNESS_ITEM_COUNT; j++) {
                        if (j < n) {
                            const itemLen = this.readVarInt()
                            if (itemLen > 0n) {
                                this.witness[i][j] = this.readBytes(itemLen)
                            }
                        }
                    }
                }
            }
        }
    }

    @method()
    parse(): boolean {
        this.version = this.readUInt32()

        this.isWitness = this.tryReadFlag()

        this.inputsCount = this.readVarInt()
        assert(this.inputsCount < MAX_BTC_TX_INPUT_COUNT, 'too much inputs')

        for (let i = 0; i < MAX_BTC_TX_INPUT_COUNT; i++) {
            if (i < this.inputsCount) {
                this.inputs[i] = this.readInput()
            }
        }

        this.outputsCount = this.readVarInt()
        assert(this.outputsCount < MAX_BTC_TX_OUTPUT_COUNT, 'too much outputs')

        for (let i = 0; i < MAX_BTC_TX_OUTPUT_COUNT; i++) {
            if (i < this.outputsCount) {
                this.outputs[i] = this.readOutput()
            }
        }

        if (this.isWitness) {
            this.readWitness()
        }

        this.nLockTime = this.readUInt32()

        return true
    }

    @method()
    getInputs(): FixedArray<Input, typeof MAX_BTC_TX_INPUT_COUNT> {
        return this.inputs
    }

    @method()
    getOutputs(): FixedArray<Output, typeof MAX_BTC_TX_OUTPUT_COUNT> {
        return this.outputs
    }

    @method()
    getWitness(): FixedArray<
        FixedArray<ByteString, typeof MAX_WITNESS_ITEM_COUNT>,
        typeof MAX_BTC_TX_INPUT_COUNT
    > {
        return this.witness
    }
}
