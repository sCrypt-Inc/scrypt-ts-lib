import { SmartContract, method, assert } from "scrypt-ts";
import { FixMath } from '../scrypt-ts-lib'

export class TestFixMath extends SmartContract{
  static readonly scale: bigint= 18446744073709551616n;

  @method()
  public testLog() {
    assert(FixMath.log(TestFixMath.scale) == 0n);

    // log(21.8)
    let res: bigint = FixMath.log(402139020806868238336n);
    assert(res == 56851204471023106498n);
  }

  @method()
  public testExp() {
    let exptest1 = FixMath.exp(10n * TestFixMath.scale);
    assert(exptest1 / TestFixMath.scale == 22026n);
  }
}
