import {
    TxParserBTC,
    Output,
    Input,
    MAX_WITNESS_ITEM_COUNT,
    MAX_BTC_TX_INPUT_COUNT,
} from '../scrypt-ts-lib'
import {
    method,
    assert,
    SmartContract,
    ByteString,
    equals,
    FixedArray,
} from 'scrypt-ts'

export class TransactionParserTest extends SmartContract {
    @method()
    public unlock(
        rawTx: ByteString,
        input: Input,
        output: Output,
        version: bigint,
        nLockTime: bigint
    ) {
        const parser = new TxParserBTC(rawTx)

        const result = parser.parse()

        assert(result == true, 'parser failed')

        assert(equals(parser.getInputs()[0], input), 'input not expected')

        assert(equals(parser.getOutputs()[0], output), 'output not expected')

        assert(parser.version == version, 'version not expected')
        assert(parser.nLockTime == nLockTime, 'nLockTime not expected')
        assert(parser.isWitness == false, 'isWitness not expected')
    }

    @method()
    public unlockWitness(
        rawTx: ByteString,
        input: Input,
        output: Output,
        version: bigint,
        nLockTime: bigint,
        witness: FixedArray<ByteString, typeof MAX_WITNESS_ITEM_COUNT>
    ) {
        const parser = new TxParserBTC(rawTx)

        const result = parser.parse()

        assert(result == true, 'parser failed')

        assert(equals(parser.getInputs()[0], input), 'input not expected')

        assert(equals(parser.getOutputs()[0], output), 'output not expected')

        assert(parser.version == version, 'version not expected')
        assert(parser.nLockTime == nLockTime, 'nLockTime not expected')
        assert(parser.isWitness == true, 'isWitness not expected')
        assert(equals(parser.getWitness()[0], witness), 'witness not expected')
    }
}
