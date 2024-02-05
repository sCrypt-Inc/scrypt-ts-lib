import { expect } from 'chai'
import { BlockchainTest } from '../contracts/blockchainTest'
import {
    Sha256,
    int2ByteString,
    toByteString,
    reverseByteString,
} from 'scrypt-ts'
import { MerkleProof, MerklePath, BlockHeader } from '../scrypt-ts-lib'

describe('Test Blockchain', () => {
    let blockchainTest: BlockchainTest

    before(async () => {
        await BlockchainTest.compile()
        blockchainTest = new BlockchainTest()
    })

    it('should pass blockHeaderHash', () => {
        let bhHash = Sha256(
            reverseByteString(
                toByteString(
                    '0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7'
                ),
                32n
            )
        )
        let bh: BlockHeader = {
            version: reverseByteString(toByteString('2000a000'), 4n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'
                    ),
                    32n
                )
            ),
            time: 1688719785n,
            bits: reverseByteString(toByteString('180dab63'), 4n),
            nonce: 602259041n,
        }

        let result = blockchainTest.verify((self) => {
            self.testBlockHeaderHash(bh, bhHash)
        })
        expect(result.success, result.error).to.be.true

        bhHash = Sha256(
            reverseByteString(
                toByteString(
                    '00000000000000000012ce7f4bbce3346ac438ab7fdcb6fa5440db9857856a7f'
                ),
                32n
            )
        )
        bh = {
            version: int2ByteString(536870912n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '0000000000000000053c806b768d74f4915d78fd2a4913fa099f4a50b1b442ae'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        'd6048f7e997478df41845bd978b659c4be1bf1fcdcd6b84fc52f3f12a78a7c94'
                    ),
                    32n
                )
            ),
            time: 1553501800n,
            bits: reverseByteString(toByteString('18097441'), 4n),
            nonce: 1491582841n,
        }

        result = blockchainTest.verify((self) => {
            self.testBlockHeaderHash(bh, bhHash)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass txInBlock', () => {
        const txid = Sha256(
            reverseByteString(
                toByteString(
                    '0b7ba8504a37c25dbbe48b18c9634ab6b6a372b19da7c5d42fd65d9d31872546'
                ),
                32n
            )
        )

        const merkleProof: MerkleProof = [
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '4ca743a40df34bd382cd997b2697dc3f81802d6f8db26457b1c50c72762ef433'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            'e507668dba0a7e858b288e98ce037957910dd3b32eaa5765391b0d30e39fe9a3'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '328cb3bd68d05b745242478105f2780b921c678fdb265d5bc6b4f0062042d3f8'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '957f11cb705cc8d00d7abadc680fe242c8dee05342ea640cb173e37be25857b5'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '71c254c2227177ab9d37cccf954fd31fac072c181687ac555c9a02c44e6e1cc1'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '707a6b081fc11869a438764c27967de23581e52f9e41c5b6603d80bb8ca11588'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            'a679a474948fe40316ea9d30df4c6894c3efefcbb648a6d6c6fcd6e1b5b0d9d2'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '37f46e53b756d3693806b49354fe1690621ddde37e0fe5b852f105ebda25eea5'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '89313a9543b1429c718c7386a7542aed6562da8f7324506cb92b1d8e30f8bbcf'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            'ad3235c1720a501c61e3c5854de575ff6870363e818bd0fd5ddacad4194ebca8'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            'a076e31d1ce283f332a1aac0353f27c3ecafa0636c1135f884e7b2af8674c2e4'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '40eb96cd7ee1edadeb6bc0f36512f075d3627071b9811661a15dcd7ab654ba94'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '024fba67b5a83ec90e9c964c79987cbc3e64a423037309b9995fcb020c6cef12'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            'c5b72ef9572f6791d81e9be8c960aff3ffa7fe077f23aaba41938d5599ec569c'
                        ),
                        32n
                    )
                ),
                pos: 1n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '437126631d268c132cb1a603661b965a1ed5b34b3bea27f525aeaa3be7b8ed50'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '90f076ecebc3d59f640eaba948a1873935ee1b1959e4eac0811c625ec58f8149'
                        ),
                        32n
                    )
                ),
                pos: 2n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        toByteString(
                            '0000000000000000000000000000000000000000000000000000000000000000'
                        ),
                        32n
                    )
                ),
                pos: 0n,
            },
        ]

        const bh: BlockHeader = {
            version: reverseByteString(toByteString('2000a000'), 4n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'
                    ),
                    32n
                )
            ),
            time: 1688719785n,
            bits: reverseByteString(toByteString('180dab63'), 4n),
            nonce: 602259041n,
        }

        const result = blockchainTest.verify((self) => {
            self.testTxInBlock(txid, bh, merkleProof, true)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass lastTxInBlock', () => {
        let txid = Sha256(
            reverseByteString(
                toByteString(
                    'b52e6ba02e124eb245b42bf8cb95b6aedc0c7a67b313f23584d80dca23e57212'
                ),
                32n
            )
        )
        let fromWoC = {
            blockHash:
                '0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7',
            branches: [
                {
                    hash: 'd371c668aed1713efbaa400037c0348a05e3281c3e87a77a9cab61216c1cd6a3',
                    pos: 'L',
                },
                {
                    hash: 'ab8c463675f1cf6fc0afc202e90e0e97f054eaa5a61a1b9bb7e4105ba7bd15a4',
                    pos: 'L',
                },
                {
                    hash: '5a8791d2fa9aff57c88714c273c49d8535343c7215508c58af5cd5814434fb64',
                    pos: 'L',
                },
                {
                    hash: '694f599d5ef09f2eed1ae6a2416838766801a920a5c48134eefa5704812de0cf',
                    pos: 'L',
                },
                {
                    hash: '0ea2a1d74b70f7aa09e39eb8e8320cbafde281fd33398f3559a205df9c514906',
                    pos: 'L',
                },
                {
                    hash: '03c4eb008eab9c5ce3fc682341dceef454e8afab6c910d4fd839b4a5552cf0dd',
                    pos: 'L',
                },
                {
                    hash: 'b36dedc394a4b6b1b141c50c9e0dd0e248e61688f915182d09502228d9942fc3',
                    pos: 'L',
                },
                {
                    hash: '1ec1223bd12009dd2025e11d391dc4484bb3807ac211642b3c9f506ac599666e',
                    pos: 'L',
                },
                {
                    hash: 'c4b76eb5633947b8c8812cc492a8edba620663bfb09da79dfe36f8bd7bb574ee',
                    pos: 'L',
                },
                {
                    hash: '66b1ab0bfce9f922c65e3bea549ee3b624c6ac8476e8a3a9a3d1819ea6b994fa',
                    pos: 'L',
                },
                {
                    hash: 'a62adcfea094e794037050904288208c5525b4753db86cb31a1bd3294954cc08',
                    pos: 'L',
                },
                {
                    hash: '898d0bf992440142d15d44fcaff0c6e62e4a17ca083f401263e4f49fa5edb30a',
                    pos: 'L',
                },
                {
                    hash: '5f969a6bef1cecd897517f583dbebc11ba08b0e4a251400db252978e58a9c44b',
                    pos: 'L',
                },
                {
                    hash: 'de0e13890adf08569ada47a82bf2efbc5b32b2f93d2c347f59896f3fb21eaba6',
                    pos: 'L',
                },
                {
                    hash: 'ab14dead4511ef1ff71d639450f657850374c9f128e4b299bbbcd4695318546d',
                    pos: 'L',
                },
                {
                    hash: '65433ea178bb0d6f0ae19cfe21b858fbadc974616fe7d088514b9ccaf626ea6e',
                    pos: 'L',
                },
            ],
            hash: 'b52e6ba02e124eb245b42bf8cb95b6aedc0c7a67b313f23584d80dca23e57212',
            merkleRoot:
                '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498',
        }
        let merkleProof: MerkleProof = prepProofFromWoc(fromWoC)

        const bh: BlockHeader = {
            version: reverseByteString(toByteString('2000a000'), 4n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'
                    ),
                    32n
                )
            ),
            time: 1688719785n,
            bits: reverseByteString(toByteString('180dab63'), 4n),
            nonce: 602259041n,
        }

        let result = blockchainTest.verify((self) => {
            self.testLastTxInBlock(txid, bh, merkleProof, true)
        })
        expect(result.success, result.error).to.be.true

        txid = Sha256(
            'e68586ee57c6a1900c0453d3f259c5a237e3905a4cf50c03f5b52705e0f119a6'
        )
        fromWoC = {
            blockHash:
                '0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7',
            branches: [
                {
                    hash: '8c0c2766003e2a593c966ebfeaeb5bd4edad2e821e2c0fb7fdcb19044d7e5b56',
                    pos: 'R',
                },
                {
                    hash: '4f4c219cd70a444a273f5d2334347bf3553deb0f906602dde2a5262c362a22f0',
                    pos: 'R',
                },
                {
                    hash: '4bafdd256701206be6077e6d87bc7e736e421e601187dc2b3264cb4d5c5ac5fe',
                    pos: 'R',
                },
                {
                    hash: 'ce65fee3ba4e53df6a1c4fa7c7d46913d40bf0077b5cc105aad98305e46bab60',
                    pos: 'R',
                },
                {
                    hash: '45dd90ec6477ae585378163e4e0a8b6b51ed6f527d1cc47c69d634ceee4ced14',
                    pos: 'R',
                },
                {
                    hash: '6ecedeacb3707ff148dd584aef446bc7cc969eb301752c4455cd5826014a0263',
                    pos: 'R',
                },
                {
                    hash: '836d2697a8e3a1be7e206bffaf7866be6ca8526d22c92d33f90c72d2aa99b5db',
                    pos: 'R',
                },
                {
                    hash: '703cdff301749c43a6f2eba88c65b158337eecc53ffff3a9da383e96e6ddcaf8',
                    pos: 'R',
                },
                {
                    hash: 'aedaecf52f985e0a3752649224f4273e3481d10ace06bf806a07e1a7feac9464',
                    pos: 'R',
                },
                {
                    hash: '8a4eeace6233347603a74bd27303c37a57c0ce2e0ee9d3c0b8035c4501340e3d',
                    pos: 'R',
                },
                {
                    hash: 'c343368c6e24314fc6f94cd87eb3cac11979c3ace7df9694532fef207c774124',
                    pos: 'R',
                },
                {
                    hash: '3c164647fd74b3b3fd8ee71d494562d25fb119ea5303a9e8de6fcd198c938ee1',
                    pos: 'R',
                },
                {
                    hash: '9d5ff25742c84801d50c6edb7d05edb84b1343666465cad89894241a9542bdde',
                    pos: 'R',
                },
                {
                    hash: '7371f3af322ee0ce5d4578e0a1016902b632692bbc88a7aae199a7187225a6af',
                    pos: 'R',
                },
                {
                    hash: '437126631d268c132cb1a603661b965a1ed5b34b3bea27f525aeaa3be7b8ed50',
                    pos: 'R',
                },
                {
                    hash: '90f076ecebc3d59f640eaba948a1873935ee1b1959e4eac0811c625ec58f8149',
                    pos: 'R',
                },
            ],
            hash: 'e68586ee57c6a1900c0453d3f259c5a237e3905a4cf50c03f5b52705e0f119a6',
            merkleRoot:
                '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498',
        }
        merkleProof = prepProofFromWoc(fromWoC)
        result = blockchainTest.verify((self) => {
            self.testLastTxInBlock(txid, bh, merkleProof, false)
        })
        expect(result.success, result.error).to.be.true

        txid = Sha256(
            'd8ecbe3e2663088d167276bf5980e098d1d24bb08989c21a5237bc18becef014'
        )
        fromWoC = {
            blockHash:
                '0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7',
            branches: [
                {
                    hash: 'c51c79fce8d18e1f85fdba691a4df696bb51e0750d0d5bf67ffe24619c9a0593',
                    pos: 'R',
                },
                {
                    hash: 'c0a3bb5b45a4d0d1c9c10df71a2804429f83f62da1fa82e551b12ae29944e9a9',
                    pos: 'R',
                },
                {
                    hash: 'affb632b21571b24d6d601be70a960ff67b70f83322eb9568f193cf69f08ca97',
                    pos: 'L',
                },
                {
                    hash: 'b1944cd90bbec89667d73862231f50cec490203dcd57ce289e2dc12a3ee2259d',
                    pos: 'L',
                },
                {
                    hash: '0603e667df6b84dad6d101fbb85afa12d916e63a88ea956aef69b3f5ed04f020',
                    pos: 'L',
                },
                {
                    hash: 'bcc6d1545874394f8af5d7d1703f3d2cef863396a5b68ce1d4ac03429d0997dd',
                    pos: 'R',
                },
                {
                    hash: 'b36dedc394a4b6b1b141c50c9e0dd0e248e61688f915182d09502228d9942fc3',
                    pos: 'L',
                },
                {
                    hash: '1ec1223bd12009dd2025e11d391dc4484bb3807ac211642b3c9f506ac599666e',
                    pos: 'L',
                },
                {
                    hash: 'c4b76eb5633947b8c8812cc492a8edba620663bfb09da79dfe36f8bd7bb574ee',
                    pos: 'L',
                },
                {
                    hash: '66b1ab0bfce9f922c65e3bea549ee3b624c6ac8476e8a3a9a3d1819ea6b994fa',
                    pos: 'L',
                },
                {
                    hash: 'a62adcfea094e794037050904288208c5525b4753db86cb31a1bd3294954cc08',
                    pos: 'L',
                },
                {
                    hash: '898d0bf992440142d15d44fcaff0c6e62e4a17ca083f401263e4f49fa5edb30a',
                    pos: 'L',
                },
                {
                    hash: '5f969a6bef1cecd897517f583dbebc11ba08b0e4a251400db252978e58a9c44b',
                    pos: 'L',
                },
                {
                    hash: 'de0e13890adf08569ada47a82bf2efbc5b32b2f93d2c347f59896f3fb21eaba6',
                    pos: 'L',
                },
                {
                    hash: 'ab14dead4511ef1ff71d639450f657850374c9f128e4b299bbbcd4695318546d',
                    pos: 'L',
                },
                {
                    hash: '65433ea178bb0d6f0ae19cfe21b858fbadc974616fe7d088514b9ccaf626ea6e',
                    pos: 'L',
                },
            ],
            hash: 'd8ecbe3e2663088d167276bf5980e098d1d24bb08989c21a5237bc18becef014',
            merkleRoot:
                '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498',
        }
        merkleProof = prepProofFromWoc(fromWoC)
        result = blockchainTest.verify((self) => {
            self.testLastTxInBlock(txid, bh, merkleProof, false)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass isValidBlockHeader', () => {
        const bh: BlockHeader = {
            version: reverseByteString(toByteString('2000a000'), 4n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'
                    ),
                    32n
                )
            ),
            time: 1688719785n,
            bits: reverseByteString(toByteString('180dab63'), 4n),
            nonce: 602259041n,
        }

        let target = pdiff2Target(80434288738.42868)
        let result = blockchainTest.verify((self) => {
            self.testIsValidBlockHeader(bh, target, true)
        })
        expect(result.success, result.error).to.be.true

        target = pdiff2Target(120434288738.42868)
        result = blockchainTest.verify((self) => {
            self.testIsValidBlockHeader(bh, target, false)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass isCoinbase', () => {
        let tx = toByteString(
            '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1a0374330c2f7461616c2e636f6d2fa34dfa12fc9233ba684e1d00ffffffff01cf756625000000001976a914522cf9e7626d9bd8729e5a1398ece40dad1b6a2f88ac00000000'
        )
        let result = blockchainTest.verify((self) => {
            self.testIsCoinbase(tx, true)
        })
        expect(result.success, result.error).to.be.true

        tx = toByteString(
            '0100000001249a0090b89f8a8ba298aa7e9dc30647fab52d8952c28b651a5e3f22ce795095000000006a47304402205d42c7a429c9a9562655702ee45539d823a137ff884e9aea87d4538fc6a50813022020b78b3b52197f2079f96ca5fc017646077b953f27b82898021179aaa548bc304121029e33ded4d37dee8fac54bc20237a589f120404019bd00b3c02459f15c72ffe6dffffffff022d680000000000001976a91447f0e7e5939a51768a406cd6a96d47490e68668688ac94c00500000000001976a9149baecf76fc56303de9b44f8299d54f5f84a8becd88ac00000000'
        )
        result = blockchainTest.verify((self) => {
            self.testIsCoinbase(tx, false)
        })
        expect(result.success, result.error).to.be.true
    })

    it('should pass blockHeight', () => {
        const coinbaseTx = toByteString(
            '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1a0374330c2f7461616c2e636f6d2fa34dfa12fc9233ba684e1d00ffffffff01cf756625000000001976a914522cf9e7626d9bd8729e5a1398ece40dad1b6a2f88ac00000000'
        )

        const bh: BlockHeader = {
            version: reverseByteString(toByteString('2000a000'), 4n),
            prevBlockHash: Sha256(
                reverseByteString(
                    toByteString(
                        '00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'
                    ),
                    32n
                )
            ),
            merkleRoot: Sha256(
                reverseByteString(
                    toByteString(
                        '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'
                    ),
                    32n
                )
            ),
            time: 1688719785n,
            bits: reverseByteString(toByteString('180dab63'), 4n),
            nonce: 602259041n,
        }

        const fromWoC = {
            blockHash:
                '0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7',
            branches: [
                {
                    hash: '8c0c2766003e2a593c966ebfeaeb5bd4edad2e821e2c0fb7fdcb19044d7e5b56',
                    pos: 'R',
                },
                {
                    hash: '4f4c219cd70a444a273f5d2334347bf3553deb0f906602dde2a5262c362a22f0',
                    pos: 'R',
                },
                {
                    hash: '4bafdd256701206be6077e6d87bc7e736e421e601187dc2b3264cb4d5c5ac5fe',
                    pos: 'R',
                },
                {
                    hash: 'ce65fee3ba4e53df6a1c4fa7c7d46913d40bf0077b5cc105aad98305e46bab60',
                    pos: 'R',
                },
                {
                    hash: '45dd90ec6477ae585378163e4e0a8b6b51ed6f527d1cc47c69d634ceee4ced14',
                    pos: 'R',
                },
                {
                    hash: '6ecedeacb3707ff148dd584aef446bc7cc969eb301752c4455cd5826014a0263',
                    pos: 'R',
                },
                {
                    hash: '836d2697a8e3a1be7e206bffaf7866be6ca8526d22c92d33f90c72d2aa99b5db',
                    pos: 'R',
                },
                {
                    hash: '703cdff301749c43a6f2eba88c65b158337eecc53ffff3a9da383e96e6ddcaf8',
                    pos: 'R',
                },
                {
                    hash: 'aedaecf52f985e0a3752649224f4273e3481d10ace06bf806a07e1a7feac9464',
                    pos: 'R',
                },
                {
                    hash: '8a4eeace6233347603a74bd27303c37a57c0ce2e0ee9d3c0b8035c4501340e3d',
                    pos: 'R',
                },
                {
                    hash: 'c343368c6e24314fc6f94cd87eb3cac11979c3ace7df9694532fef207c774124',
                    pos: 'R',
                },
                {
                    hash: '3c164647fd74b3b3fd8ee71d494562d25fb119ea5303a9e8de6fcd198c938ee1',
                    pos: 'R',
                },
                {
                    hash: '9d5ff25742c84801d50c6edb7d05edb84b1343666465cad89894241a9542bdde',
                    pos: 'R',
                },
                {
                    hash: '7371f3af322ee0ce5d4578e0a1016902b632692bbc88a7aae199a7187225a6af',
                    pos: 'R',
                },
                {
                    hash: '437126631d268c132cb1a603661b965a1ed5b34b3bea27f525aeaa3be7b8ed50',
                    pos: 'R',
                },
                {
                    hash: '90f076ecebc3d59f640eaba948a1873935ee1b1959e4eac0811c625ec58f8149',
                    pos: 'R',
                },
            ],
            hash: 'e68586ee57c6a1900c0453d3f259c5a237e3905a4cf50c03f5b52705e0f119a6',
            merkleRoot:
                '3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498',
        }
        const merkleProof = prepProofFromWoc(fromWoC)

        const result = blockchainTest.verify((self) => {
            self.testBlockHeight(bh, coinbaseTx, merkleProof, 799604n)
        })
        expect(result.success, result.error).to.be.true
    })

    //it('should pass txIndex', () => {
    //    let txIdx = 30553n
    //    let fromWoC =
    //    {
    //        "blockHash": "0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7",
    //        "branches": [
    //            {
    //                "hash": "0401c91563f59677afd4a01505fbd6fd449f770fd1e8383dfac7494d369bfb79",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "fcaf88405fcd461c3191dcb1805c4b8e432ac9154d029b9d4dbafd4a604a3e26",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "d8a7fbc10cb577deadd5306356d7b7e69c38ffbb40d93f069c693a4dd09a1856",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "96e2dedfcc2d1fa647c1e6735e85c77f050f95f1b660769219cb4657709adcfb",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "b8eb5366c8bcf10a20715b1e434c073682071d2b927f2b0cdb5c70838f526d1c",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "c5e842a5fde2dda4df7ea89d84c7d423449b0ee211bdc1ae4decf14488c44979",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "9e7f54bc457377d60ad23f7d05d702cd0de84f4472b2afe0f4410229b0c89bb3",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "d34e2650b04d10249c35579bf61237d1586ad2cec22945e1cda046ee69ae58a0",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "20856df7e2a88c96b39ba53aade13d2e9dbb450785e446f2f1d03d2894e5ea44",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "e353fa05c3f3b980438b8e44c7fea359d3adeeba06db917823ee5609bc42103c",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "e85443796bc4f195be5ae9fa8eca1ec122ce4b465c926ee7f01f46f5a22fa4f2",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "e63c979b5223041cbaaa2ae55b6365bd866514308eced42a056327904c677cd8",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "1f956b271899f6e5a4e5145cf783811fc1b90b8fb7a00cb3d8ae9f7645b18cc2",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "3a3a8b77fd1327753741927800f40ab47b9dfc7fb31225cb1be9f5baf4d8f68c",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "c7d326a0fefc50a8005bedd641c869daca0443deb5cf6dbd9d30bca6b6dab8b0",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "90f076ecebc3d59f640eaba948a1873935ee1b1959e4eac0811c625ec58f8149",
    //                "pos": "R"
    //            }
    //        ],
    //        "hash": "48ad6b3d86e79f8c7573bba93aad67964bac73f5205f55957fccc196a511383a",
    //        "merkleRoot": "3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498"
    //    }
    //    let merkleProof: MerkleProof = prepProofFromWoc(fromWoC)

    //    let result = blockchainTest.verify((self) => {
    //        self.testTxIndex(merkleProof, txIdx)
    //    })
    //    expect(result.success, result.error).to.be.true

    //    txIdx = 577n
    //    fromWoC =
    //    {
    //        "blockHash": "0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7",
    //        "branches": [
    //            {
    //                "hash": "b525ed2ff338cb4dd28ffa0f0a9ebfcaf9b103efcc269529331c596621095017",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "867d0e9e1177149debb7de90ef356b04d33672af757e2c2882eb62ea8ce505e2",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "f6f89694298a39efe2c73968c07c15b9f1d795567075b75f1e98ebcb40864396",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "ae4a89f3a68eca4c2e9402762593f40be142e30f24e67c18ac836db2f7733198",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "c0adf732dfb26216a6a8c79dba55e61480f1444e41377061600d239a31dbf773",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "cec5e5560d6d77ea92f9f0e4843bff152e00aaead29136a7399713f52cbc6980",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "8d78b7ae3bbacba3580aedfa243fa70029ca68de70ad6117acf00336decea76b",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "42f83496b7bc8ebedacbb564e6b19dbb803576e33224e01f1283b651e11604d3",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "bd83d71864ecfd905e2db7776bbb7f1c8e083d0278053d282fd5910aee7481be",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "b7d3f3b6ac73c8cab791d00a16970f0072e4ca52ed43cf4b311362f7d4129bee",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "c343368c6e24314fc6f94cd87eb3cac11979c3ace7df9694532fef207c774124",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "3c164647fd74b3b3fd8ee71d494562d25fb119ea5303a9e8de6fcd198c938ee1",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "9d5ff25742c84801d50c6edb7d05edb84b1343666465cad89894241a9542bdde",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "7371f3af322ee0ce5d4578e0a1016902b632692bbc88a7aae199a7187225a6af",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "437126631d268c132cb1a603661b965a1ed5b34b3bea27f525aeaa3be7b8ed50",
    //                "pos": "R"
    //            },
    //            {
    //                "hash": "90f076ecebc3d59f640eaba948a1873935ee1b1959e4eac0811c625ec58f8149",
    //                "pos": "R"
    //            }
    //        ],
    //        "hash": "22101383b720e5d36f034626f6226324359dd7a6873dbc4a5bd5a8201ea74d69",
    //        "merkleRoot": "3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498"
    //    }
    //    merkleProof = prepProofFromWoc(fromWoC)

    //    result = blockchainTest.verify((self) => {
    //        self.testTxIndex(merkleProof, txIdx)
    //    })
    //    expect(result.success, result.error).to.be.true
    //
    //    txIdx = 40553n
    //    fromWoC =
    //    {
    //        "blockHash": "0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7",
    //        "branches": [
    //            {
    //                "hash": "d371c668aed1713efbaa400037c0348a05e3281c3e87a77a9cab61216c1cd6a3",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "ab8c463675f1cf6fc0afc202e90e0e97f054eaa5a61a1b9bb7e4105ba7bd15a4",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "5a8791d2fa9aff57c88714c273c49d8535343c7215508c58af5cd5814434fb64",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "694f599d5ef09f2eed1ae6a2416838766801a920a5c48134eefa5704812de0cf",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "0ea2a1d74b70f7aa09e39eb8e8320cbafde281fd33398f3559a205df9c514906",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "03c4eb008eab9c5ce3fc682341dceef454e8afab6c910d4fd839b4a5552cf0dd",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "b36dedc394a4b6b1b141c50c9e0dd0e248e61688f915182d09502228d9942fc3",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "1ec1223bd12009dd2025e11d391dc4484bb3807ac211642b3c9f506ac599666e",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "c4b76eb5633947b8c8812cc492a8edba620663bfb09da79dfe36f8bd7bb574ee",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "66b1ab0bfce9f922c65e3bea549ee3b624c6ac8476e8a3a9a3d1819ea6b994fa",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "a62adcfea094e794037050904288208c5525b4753db86cb31a1bd3294954cc08",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "898d0bf992440142d15d44fcaff0c6e62e4a17ca083f401263e4f49fa5edb30a",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "5f969a6bef1cecd897517f583dbebc11ba08b0e4a251400db252978e58a9c44b",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "de0e13890adf08569ada47a82bf2efbc5b32b2f93d2c347f59896f3fb21eaba6",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "ab14dead4511ef1ff71d639450f657850374c9f128e4b299bbbcd4695318546d",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "65433ea178bb0d6f0ae19cfe21b858fbadc974616fe7d088514b9ccaf626ea6e",
    //                "pos": "L"
    //            }
    //        ],
    //        "hash": "b52e6ba02e124eb245b42bf8cb95b6aedc0c7a67b313f23584d80dca23e57212",
    //        "merkleRoot": "3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498"
    //    }
    //    merkleProof = prepProofFromWoc(fromWoC)

    //    result = blockchainTest.verify((self) => {
    //        self.testTxIndex(merkleProof, txIdx)
    //    })
    //    expect(result.success, result.error).to.be.true
    //})
    //
    //
    //it('should pass blockTxCount', () => {
    //    let txCount = 40554n
    //    let lastTxId = Sha256(reverseByteString(toByteString('b52e6ba02e124eb245b42bf8cb95b6aedc0c7a67b313f23584d80dca23e57212'), 32n))
    //    let fromWoC =
    //    {
    //        "blockHash": "0000000000000000066242e860957a42b56cb11f1cc02671759453aa8657e6f7",
    //        "branches": [
    //            {
    //                "hash": "d371c668aed1713efbaa400037c0348a05e3281c3e87a77a9cab61216c1cd6a3",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "ab8c463675f1cf6fc0afc202e90e0e97f054eaa5a61a1b9bb7e4105ba7bd15a4",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "5a8791d2fa9aff57c88714c273c49d8535343c7215508c58af5cd5814434fb64",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "694f599d5ef09f2eed1ae6a2416838766801a920a5c48134eefa5704812de0cf",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "0ea2a1d74b70f7aa09e39eb8e8320cbafde281fd33398f3559a205df9c514906",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "03c4eb008eab9c5ce3fc682341dceef454e8afab6c910d4fd839b4a5552cf0dd",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "b36dedc394a4b6b1b141c50c9e0dd0e248e61688f915182d09502228d9942fc3",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "1ec1223bd12009dd2025e11d391dc4484bb3807ac211642b3c9f506ac599666e",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "c4b76eb5633947b8c8812cc492a8edba620663bfb09da79dfe36f8bd7bb574ee",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "66b1ab0bfce9f922c65e3bea549ee3b624c6ac8476e8a3a9a3d1819ea6b994fa",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "a62adcfea094e794037050904288208c5525b4753db86cb31a1bd3294954cc08",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "898d0bf992440142d15d44fcaff0c6e62e4a17ca083f401263e4f49fa5edb30a",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "5f969a6bef1cecd897517f583dbebc11ba08b0e4a251400db252978e58a9c44b",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "de0e13890adf08569ada47a82bf2efbc5b32b2f93d2c347f59896f3fb21eaba6",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "ab14dead4511ef1ff71d639450f657850374c9f128e4b299bbbcd4695318546d",
    //                "pos": "L"
    //            },
    //            {
    //                "hash": "65433ea178bb0d6f0ae19cfe21b858fbadc974616fe7d088514b9ccaf626ea6e",
    //                "pos": "L"
    //            }
    //        ],
    //        "hash": "b52e6ba02e124eb245b42bf8cb95b6aedc0c7a67b313f23584d80dca23e57212",
    //        "merkleRoot": "3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498"
    //    }
    //    let merkleProof: MerkleProof = prepProofFromWoc(fromWoC)

    //    let bh: BlockHeader = {
    //        version: reverseByteString(toByteString('2000a000'), 4n),
    //        prevBlockHash: Sha256(reverseByteString(toByteString('00000000000000000abd345bd668994b2f1338e5197f95db8f59ac43b22f3d0d'), 32n)),
    //        merkleRoot: Sha256(reverseByteString(toByteString('3ea59132fc323e633225e94803b4c78369e3e6838f1ef7c7c5cd6ac71b669498'), 32n)),
    //        time: 1688719785n,
    //        bits: reverseByteString(toByteString('180dab63'), 4n),
    //        nonce: 602259041n
    //    }
    //
    //    let result = blockchainTest.verify((self) => {
    //        self.testBlockTxCount(bh, lastTxId, merkleProof, txCount)
    //    })
    //    expect(result.success, result.error).to.be.true
    //})
})

function prepProofFromWoc(proof: any): MerkleProof {
    const res = []

    proof.branches.forEach((element) => {
        res.push({
            hash: Sha256(reverseByteString(toByteString(element['hash']), 32n)),
            pos:
                element['pos'] == 'L'
                    ? MerklePath.LEFT_NODE
                    : MerklePath.RIGHT_NODE,
        })
    })

    // Pad remainder with invalid nodes.
    const invalidNode = {
        hash: Sha256(
            '0000000000000000000000000000000000000000000000000000000000000000'
        ),
        pos: MerklePath.INVALID_NODE,
    }
    return [...res, ...Array(32 - res.length).fill(invalidNode)] as MerkleProof
}

/**
 * convert pool difficulty to a target number
 * @param {*}  difficulty which can fetch by api https://api.whatsonchain.com/v1/bsv/<network>/chain/info
 * @returns target
 */
function pdiff2Target(difficulty) {
    if (typeof difficulty === 'number') {
        difficulty = BigInt(Math.floor(difficulty))
    }

    return BigInt(toTarget('1d00ffff') / difficulty)
}

/**
 * inspired by : https://bigishdata.com/2017/11/13/how-to-build-a-blockchain-part-4-1-bitcoin-proof-of-work-difficulty-explained/
 * @param {*} bitsHex bits of block header, in big endian
 * @returns a target number
 */
function toTarget(bitsHex) {
    const shift = bitsHex.substr(0, 2)
    const exponent = parseInt(shift, 16)
    const value = bitsHex.substr(2, bitsHex.length)
    const coefficient = parseInt(value, 16)
    const target = coefficient * 2 ** (8 * (exponent - 3))
    return BigInt(target)
}
