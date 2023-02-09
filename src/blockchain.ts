import { assert } from 'console'
import {
    prop,
    method,
    SmartContractLib,
    hash256,
    Sha256,
    Utils,
    ByteString,
    toByteString,
    rshift,
} from 'scrypt-ts'
import { MerkleProof, MerklePath } from './merklePath'

export type BlockHeader = {
    version: ByteString
    prevBlockHash: Sha256
    merkleRoot: Sha256
    time: bigint
    bits: ByteString // Difficulty target
    nonce: bigint
}

export class Blockchain extends SmartContractLib {
    // Block height's position relative to the beginning of coinbase tx.
    // TODO: This assumes unlocking script can be pushed using OP_PUSH_1. See if it always holds?
    @prop()
    static readonly BLOCK_HEIGHT_POS: bigint = 42n

    // SPV: Is a txid in a block
    @method()
    static txInBlock(
        txid: Sha256,
        bh: BlockHeader,
        merkleProof: MerkleProof
    ): boolean {
        return MerklePath.calcMerkleRoot(txid, merkleProof) == bh.merkleRoot
    }

    // Is txid the last transaction in a block
    @method()
    static lastTxInBlock(
        txid: Sha256,
        bh: BlockHeader,
        merkleProof: MerkleProof
    ): boolean {
        let last = true
        let root = txid

        for (let i = 0; i < MerklePath.DEPTH; i++) {
            const node = merkleProof[i]

            if (node.pos != MerklePath.INVALID_NODE) {
                // s is valid
                // If node on the merkle path is on the right, it must be a duplicate.
                // If node on the merkle path is on the left, it must NOT be a duplicate.
                if (
                    (node.pos != MerklePath.LEFT_NODE && node.hash != root) ||
                    (node.pos == MerklePath.LEFT_NODE && node.hash == root)
                ) {
                    last = false
                }

                root = Sha256(
                    node.pos == MerklePath.LEFT_NODE
                        ? hash256(node.hash + root)
                        : hash256(root + node.hash)
                )
            }
        }

        return last && root == bh.merkleRoot
    }

    // Calculate a tx's index in a block from its merkle path.
    // Goes from top to bottom, the path basically encodes the index in binary form.
    // left/L means 1, and right/R 0: e.g., (L, R, L) denotes 101 in binary, and 5 in decimal
    @method()
    static txIndex(merkleProof: MerkleProof): bigint {
        let sum = 0n

        // traverse the path from top to bottom
        for (let i = 0; i < MerklePath.DEPTH; i++) {
            const node = merkleProof[Number(MerklePath.DEPTH) - i - 1]

            if (node.pos != MerklePath.INVALID_NODE) {
                sum *= 2n
                if (node.pos == MerklePath.LEFT_NODE) {
                    sum++
                }
            }
        }
        return sum
    }

    // Get number of transactions in a block.
    @method()
    static blockTxCount(
        bh: BlockHeader,
        lastTxid: Sha256,
        merkleProof: MerkleProof
    ): bigint {
        // Ensure this tx is indeed the last one.
        assert(Blockchain.lastTxInBlock(lastTxid, bh, merkleProof))
        return Blockchain.txIndex(merkleProof) + 1n
    }

    // Is block header valid with difficulty meeting target.
    @method()
    static isBlockHeaderValid(
        bh: BlockHeader,
        blockchainTarget: bigint
    ): boolean {
        const bhHash = Blockchain.blockHeaderHashAsInt(bh)
        const target = Blockchain.bits2Target(bh.bits)
        // Block hash below target and target below blockchain difficulty target.
        return bhHash <= target && target <= blockchainTarget
    }

    // Is a chain of block headers valid.
    // TODO

    // Is raw transaction a coinbase tx.
    @method()
    static isCoinbase(tx: ByteString): boolean {
        return (
            tx.slice(4, 5) == toByteString('01') && // only 1 input
            tx.slice(5, 37) ==
                toByteString(
                    '0000000000000000000000000000000000000000000000000000000000000000'
                ) && // null txid: all zeros
            tx.slice(37, 41) == toByteString('FFFFFFFF')
        ) // null vout: all Fs
    }

    // Get height of the block identified by the header.
    @method()
    static blockHeight(
        bh: BlockHeader,
        coinbaseTx: ByteString,
        merkleProof: MerkleProof
    ): bigint {
        // Ensure coinbase it's in the block.
        assert(
            Blockchain.txInBlock(Sha256(hash256(coinbaseTx)), bh, merkleProof)
        )

        // Ensure it's the coinbase.
        assert(MerklePath.isCoinbase(merkleProof))

        return Blockchain.readBlockHeight(coinbaseTx)
    }

    // Parse block height from coinbase tx: BIP34
    @method()
    static readBlockHeight(coinbaseTx: ByteString): bigint {
        // Block height is at the beginning of the unlocking script and encoded in varint.
        // TODO
        //return Utils.fromLEUnsigned(Utils.readVarint(coinbaseTx.slice(BLOCK_HEIGHT_POS))
        return 0n
    }

    // Convert difficulty from bits to target.
    @method()
    static bits2Target(bits: ByteString): bigint {
        const exponent = Utils.fromLEUnsigned(bits.slice(3, 4))
        const coefficient = Utils.fromLEUnsigned(bits.slice(0, 3))
        const n = 8n * (exponent - 3n)
        return rshift(coefficient, n)
    }

    // Serialize a block header.
    @method()
    static serialize(bh: BlockHeader): ByteString {
        return (
            bh.version +
            bh.prevBlockHash +
            bh.merkleRoot +
            Utils.toLEUnsigned(bh.time, 4n) +
            bh.bits +
            Utils.toLEUnsigned(bh.nonce, 4n)
        )
    }

    // Block header hash.
    @method()
    static blockHeaderHash(bh: BlockHeader): Sha256 {
        return Sha256(hash256(Blockchain.serialize(bh)))
    }

    // Block header hash, but converted to a positive integer.
    @method()
    static blockHeaderHashAsInt(bh: BlockHeader): bigint {
        return Utils.fromLEUnsigned(Blockchain.blockHeaderHash(bh))
    }
}
