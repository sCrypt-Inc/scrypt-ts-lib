#!/bin/sh


apply() {
    scryptSrc=$1
    dirOptim=$2

    for fAsm in $(find $dirOptim -type f -name '*.asm'); do
        funcName=$(basename $fAsm .asm)
        node optimizations/replaceFuncBodyAsm.js $scryptSrc $funcName $fAsm > $scryptSrc.tmp
        mv $scryptSrc.tmp $scryptSrc
    done

}

# BN256
apply artifacts/src/ec/bn256.scrypt optimizations/ec/bn256

# SECP256K1
apply artifacts/src/ec/secp256k1.scrypt optimizations/ec/secp256k1

# SECP256R1
apply artifacts/src/ec/secp256r1.scrypt optimizations/ec/secp256r1