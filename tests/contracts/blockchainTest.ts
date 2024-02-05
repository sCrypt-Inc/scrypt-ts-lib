import { method, assert, SmartContract, ByteString, Sha256 } from 'scrypt-ts'
import { MerkleProof, BlockHeader, Blockchain } from '../scrypt-ts-lib'

export class BlockchainTest extends SmartContract {
    @method()
    public testTxInBlock(
        txid: Sha256,
        bh: BlockHeader,
        merkleProof: MerkleProof,
        res: boolean
    ) {
        assert(Blockchain.txInBlock(txid, bh, merkleProof, 32) == res)
    }

    @method()
    public testBlockHeaderHash(bh: BlockHeader, res: Sha256) {
        assert(Blockchain.blockHeaderHash(bh) == res)
    }

    @method()
    public testLastTxInBlock(
        txid: Sha256,
        bh: BlockHeader,
        merkleProof: MerkleProof,
        res: boolean
    ) {
        assert(Blockchain.lastTxInBlock(txid, bh, merkleProof, 32) == res)
    }

    @method()
    public testIsValidBlockHeader(
        bh: BlockHeader,
        target: bigint,
        res: boolean
    ) {
        assert(Blockchain.isValidBlockHeader(bh, target) == res)
    }

    @method()
    public testIsCoinbase(tx: ByteString, res: boolean) {
        assert(Blockchain.isCoinbase(tx) == res)
    }

    @method()
    public testBlockHeight(
        bh: BlockHeader,
        coinbaseTx: ByteString,
        merkleProof: MerkleProof,
        res: bigint
    ) {
        assert(Blockchain.blockHeight(bh, coinbaseTx, merkleProof, 32) == res)
    }

    //@method()
    //public testTxIndex(
    //    merkleProof: MerkleProof,
    //    res: bigint
    //) {
    //    assert(Blockchain.txIndex(merkleProof) == res)
    //}

    //@method()
    //public testBlockTxCount(
    //    bh: BlockHeader,
    //    lastTxId: Sha256,
    //    merkleProof: MerkleProof,
    //    res: bigint
    //) {
    //    assert(Blockchain.blockTxCount(bh, lastTxId, merkleProof) == res)
    //}
}
