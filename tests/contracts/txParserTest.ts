import { TxParser, Output, Input } from '../scrypt-ts-lib'
import { method, assert, SmartContract, ByteString, equals } from 'scrypt-ts'

export class TransactionParserTest extends SmartContract {
    @method()
    public unlock(
        rawTx: ByteString,
        input: Input,
        output: Output,
        version: bigint,
        nLockTime: bigint
    ) {
        const parser = new TxParser(rawTx)

        const result = parser.parse()

        assert(result == true, 'parser failed')

        assert(equals(parser.getInputs()[0], input), 'input not expected')

        assert(equals(parser.getOutputs()[0], output), 'output not expected')

        assert(parser.version == version, 'version not expected')
        assert(parser.nLockTime == nLockTime, 'nLockTime not expected')
    }
}
