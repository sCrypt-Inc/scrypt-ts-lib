[![CI-Test](https://github.com/sCrypt-Inc/scrypt-ts-lib/actions/workflows/ci.yml/badge.svg)](https://github.com/sCrypt-Inc/scrypt-ts-lib/actions/workflows/ci.yml)
[![Build Status](https://app.travis-ci.com/sCrypt-Inc/scrypt-ts-lib.svg?branch=master)](https://app.travis-ci.com/sCrypt-Inc/scrypt-ts-lib)

# scrypt-ts-lib

A collection of contracts and libraries for writing smart contracts with [`scrypt-ts`](https://www.npmjs.com/package/scrypt-ts).

## Installation

You can install `scrypt-ts-lib` to your project with this command:

```sh
npm install scrypt-ts-lib
```

## Usage

You can use the contracts or libraries by importing them like this:

```ts
import { Mimc7 } from "scrypt-ts-lib";
```

or

```ts
import { Mimc7 } from "scrypt-ts-lib/dist/hash/mimc7";
```

Then use them in your contract like:

```ts
class MyContract extends SmartContract {
  @method
  public unlock(x: bigint, k: bigint, h: bigint) {
    // call imported library method
    assert(Mimc7.hash(x, k) == h);
  }
}
```

## Contributing

Pull requests are welcome.

## Learn More

You can learn more about how to write smart contracts with `scrypt-ts` from [here](https://scrypt.io/scrypt-ts/).
