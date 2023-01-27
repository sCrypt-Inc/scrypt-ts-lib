import { expect } from 'chai'
import { MerklePath, MerkleProof } from '../src/merklePath'
import { method, assert, SmartContract, Sha256, reverseBytes } from 'scrypt-ts'

class MerklePathTest extends SmartContract {
    @method()
    public calcMerkleRoot(leaf: Sha256, merkleProof: MerkleProof, res: Sha256) {
        assert(MerklePath.calcMerkleRoot(leaf, merkleProof) == res)
    }

    @method()
    public isCoinbase(merkleProof: MerkleProof, res: boolean) {
        assert(MerklePath.isCoinbase(merkleProof) == res)
    }
}

describe('Test Merkle Path', () => {
    let merklePathTest

    before(async () => {
        await MerklePathTest.compile()
        merklePathTest = new MerklePathTest()
    })

    it('merkle', () => {
        const leaf = Sha256(
            reverseBytes(
                'b56e7872506c7eedbda2c0c777235a827014e0cd4511dc16c8819e828ca6b2cb',
                32
            )
        ) // Usually TX hash
        const merkleRoot = Sha256(
            reverseBytes(
                '9662207b12f8d515eaad007828c9e9f404496d805e00033461b235162aaf83d6',
                32
            )
        )

        const merkleProof: MerkleProof = [
            {
                hash: Sha256(
                    reverseBytes(
                        '5c467fff75d9b287543af108b915ab2f1292b4455bdfee581b84688e02f1757f',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '28cf703de3c228d6137a22d78664ef4adee60f58bedebd93a1524d086e580d77',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '1ed596283bbbbbec777779f6e15b49641a2821c8a5c6bc6532c8c93705ed5e1f',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'bf09df2adb28700296884a4d98c4557602d9e192f74261ba596256d70951cc14',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '2170ac7dd082f91f79e26f608334912f51342840004c44f467a6160a9bde21be',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '21b9cb162a3c4fd8b13e4c31dc20f340bef05511f21e576325da7106b506dd73',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'a5d0a5adff3f4e19536313e4b8d1a883758d30a8b5bfa97666e3d120a4fad4d4',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '3c9eae626871a5a97f16bf27451b0f1eda63ad65e4aabe7007ca4aaaaea04349',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '74e31bdf48fb91784874194238dba3aff933331e6ad1ee78f29e29216364d934',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'b4638203ebc68a5bc3dac151373b44b7b326421e152aa91c8bf6665920799f5c',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'e78e29bfdb7dc728f96be29462a73fe97fa9aa3f458b12863c6ac64e7fc17c17',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '7dc21d4fb04fc56709988652c55257c51deb23f147d22e46f41a6b3bf79c50ae',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '8e314e3bc7193773342c3982fe1c28a08010c2f88b03d4e41e0b9bd1f99a513b',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'a0a47ef3439eada02b68a16f93e1876eee6694e6a24a4cbeaf708bc6f29f6f14',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '40330475405b219552d7067c33702da70c33107f0a6556304ea61b861672ddbc',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '1c344c713e744c48e25f0023a55dbf45fce1a72ba721ba130927a524043b6862',
                        32
                    )
                ),
                pos: MerklePath.LEFT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'c11762d7987539e97030d0e581226b23607dddc5503dfdcd675b7825abd1b356',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '16f8810622c4c6d5c4a950a02eae60a4141e4f260a3ea91f76721575de4572e6',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '4ca42e393a4cff6d9d4e837d29d23cd36f9b6fc0f35e1e043ca68e06f1cbaf66',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'c973ca6289dc0861ee4804d0dbaf8bd7d227b79d9ca73fa208e079cb95bcadbc',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '713e20bf8fd50f287b58669cbba114a154d279053adae07ee4af9d5967c265f7',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'bba3635e83a918fa0b39c564b746aa8cf0e8c71055b74b30253cd19aaa7503da',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE }, // Fill in rest to match buffer len
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
        ]

        const result = merklePathTest.verify((self) => {
            self.calcMerkleRoot(leaf, merkleProof, merkleRoot)
        })
        expect(result.success, result.error).to.be.true

        // Sould fail if anything is off
        merkleProof[9] = {
            hash: Sha256(
                reverseBytes(
                    'b4638203ebc68a5bc3dac151373b44b7b326421e152fa91c8bf6665920799f5c',
                    32
                )
            ),
            pos: MerklePath.RIGHT_NODE,
        }
        expect(() => {
            merklePathTest.verify((self) => {
                self.calcMerkleRoot(leaf, merkleProof, merkleRoot)
            })
        }).to.throw(/Execution failed/)
    })

    it('coinbase check', () => {
        // Proof of coinbase from block #733689

        const merkleProof: MerkleProof = [
            {
                hash: Sha256(
                    reverseBytes(
                        '0d94d2877125f035ca36e5c9b0e00e4208dc8dda6056f8428b7b5f290cecd366',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '5bebce7f78dc51990444d466790d36e662835783747ad57f8db9fd6b3a1c498a',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '1387df5711853bda591c8d808fa59cf04908af39ffc3d22a3ed37941eb5f90ea',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '5ebfa5732a9bc2cf5278dd271acf3a8947d852d514d7fa604bc3e4a6b0f71161',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '5e25e05f0f85abd6767cafbb417f2010d42b15266a38f5fef5db34372a4be0a2',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '20e0918aa1b901ce0833c50b210f6dcc06b60244f40c5edd82d69e5f65b3ee91',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'b2e5e34d9c2b12af58429c58125f3bc4218d4c4de0750d8ae1187cda8c8a034a',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'fd37121b8e219de2fa245f5c978f3bd9e3afe6276c17aac20d8f0d15ae1b35b4',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'e144e2c03ef9d1206a2cbdc2a915960a2bdb746d8546492e85f5ee387d7ca18e',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '06f2596ba1ddf438136d7e19460c4ec889bac32aa4a6dab23d07a48dc2c94e78',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '2c6527ee35acacb5b90a197995845bf5ccbb94d7f446a20533e013148ccca16d',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'af0d4ed15108072e8f499dfded774b19d9b8e31b051ddf289bf6060efc2379f8',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '5c2ffbd1fa196ca7ddee678821f35374f8878d0b729ba86ab5d3fd660d7d0f0f',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '1af00f6489231f0111f8201fabd787c889e0db0774e0e286f15f9e75dc379c82',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'fb7a7286ba759c63bb960c54520081a9e6079e4f58cb5d1172baec143ca48e76',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '548a6ffbf7742d8891e273a7c7414f294f0d96baf5845b840c17f7d98e47259d',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'c11762d7987539e97030d0e581226b23607dddc5503dfdcd675b7825abd1b356',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '16f8810622c4c6d5c4a950a02eae60a4141e4f260a3ea91f76721575de4572e6',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '4ca42e393a4cff6d9d4e837d29d23cd36f9b6fc0f35e1e043ca68e06f1cbaf66',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'c973ca6289dc0861ee4804d0dbaf8bd7d227b79d9ca73fa208e079cb95bcadbc',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        '713e20bf8fd50f287b58669cbba114a154d279053adae07ee4af9d5967c265f7',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            {
                hash: Sha256(
                    reverseBytes(
                        'bba3635e83a918fa0b39c564b746aa8cf0e8c71055b74b30253cd19aaa7503da',
                        32
                    )
                ),
                pos: MerklePath.RIGHT_NODE,
            },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE }, // Fill in rest to match buffer len
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
            { hash: Sha256('00'.repeat(32)), pos: MerklePath.INVALID_NODE },
        ]

        let result = merklePathTest.verify((self) => {
            self.isCoinbase(merkleProof, true)
        })
        expect(result.success, result.error).to.be.true

        merkleProof[9].pos = MerklePath.LEFT_NODE
        result = merklePathTest.verify((self) => {
            self.isCoinbase(merkleProof, false)
        })
        expect(result.success, result.error).to.be.true
    })
})
