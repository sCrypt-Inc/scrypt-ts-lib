import { MerklePath, MerkleProof } from '../../src/merklePath'
import { method, assert, SmartContract, Sha256 } from 'scrypt-ts'

export class MerklePathTest extends SmartContract {
    @method()
    public calcMerkleRoot(leaf: Sha256, merkleProof: MerkleProof, res: Sha256) {
        assert(MerklePath.calcMerkleRoot(leaf, merkleProof) == res)
    }

    @method()
    public isCoinbase(merkleProof: MerkleProof, res: boolean) {
        assert(MerklePath.isCoinbase(merkleProof) == res)
    }
}
