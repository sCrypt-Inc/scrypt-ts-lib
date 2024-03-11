import { SmartContractLib, assert, lshift, method, rshift } from "scrypt-ts";

export class FixMath extends SmartContractLib{
    /**
    * Fixed Point implementations of log, log2, log10 and exp.
    * Only works for positive numbers.
    *
    * Adapted from https://github.com/PetteriAimonen/libfixmath
    */
  
    static  precision : bigint = 64n;
    static scale : bigint = 18446744073709551616n; // 2 ^ precision
  
    static ln2 : bigint = 12786308645202657280n; // log(x) * scale / log2(x)
    static ln10 : bigint = 5553023288523357184n; // log10(x) * scale / log2(x)
    static fixE : bigint = 50143449209799254016n; // e * scale
    static log2e : bigint = 26613026195688644608n; // Math.floor(Math.log2(Math.E) * 2**64)
  
    /**
    * Calculates the binary exponent of x using the binary fraction method.
    * Accepts and returns scaled by 2**64 (64-bit fixed-point number).
    * Adapted from https://github.com/paulrberg/prb-math
    */
   @method()
    static exp2(x: bigint) : bigint {
      if (x > 3541774862152233910272 || x < -1103017633157748883456) {
        // 192 max value
        // -59.794705707972522261 min value
        assert(false);
      }
  
      // Start from 0.5 in the 192.64-bit fixed-point format.
      let result : bigint = 0x800000000000000000000000000000000000000000000000n;
  
      // Multiply the result by root(2, 2^-i) when the bit at position i is 1. None of the intermediary results overflows
      // because the initial result is 2^191 and all magic factors are less than 2^65.
      if ((x & 0x8000000000000000n) > 0n) {
        result = rshift(result * 0x16a09e667f3bcc909n, FixMath.precision);
      }
      if ((x & 0x4000000000000000n) > 0n) {
        result = rshift(result * 0x1306fe0a31b7152dfn, FixMath.precision);
      }
      if ((x & 0x2000000000000000n) > 0n) {
        result = rshift(result * 0x1172b83c7d517adcen, FixMath.precision);
      }
      if ((x & 0x1000000000000000n) > 0n) {
        result = rshift(result * 0x10b5586cf9890f62an, FixMath.precision);
      }
      if ((x & 0x800000000000000n) > 0n) {
        result = rshift(result * 0x1059b0d31585743aen, FixMath.precision);
      }
      if ((x & 0x400000000000000n) > 0n) {
        result = rshift(result * 0x102c9a3e778060ee7n, FixMath.precision);
      }
      if ((x & 0x200000000000000n) > 0n) {
        result = rshift(result * 0x10163da9fb33356d8n, FixMath.precision);
      }
      if ((x & 0x100000000000000n) > 0n) {
        result = rshift(result * 0x100b1afa5abcbed61n, FixMath.precision);
      }
      if ((x & 0x80000000000000n) > 0n) {
        result = rshift(result * 0x10058c86da1c09ea2n, FixMath.precision);
      }
      if ((x & 0x40000000000000n) > 0n) {
        result = rshift(result * 0x1002c605e2e8cec50n, FixMath.precision);
      }
      if ((x & 0x20000000000000n) > 0n) {
        result = rshift(result * 0x100162f3904051fa1n, FixMath.precision);
      }
      if ((x & 0x10000000000000n) > 0n) {
        result = rshift(result * 0x1000b175effdc76ban, FixMath.precision);
      }
      if ((x & 0x8000000000000n) > 0n) {
        result = rshift(result * 0x100058ba01fb9f96dn, FixMath.precision);
      }
      if ((x & 0x4000000000000n) > 0n) {
        result = rshift(result * 0x10002c5cc37da9492n, FixMath.precision);
      }
      if ((x & 0x2000000000000n) > 0n) {
        result = rshift(result * 0x1000162e525ee0547n, FixMath.precision);
      }
      if ((x & 0x1000000000000n) > 0n) {
        result = rshift(result * 0x10000b17255775c04n, FixMath.precision);
      }
      if ((x & 0x800000000000n) > 0n) {
        result = rshift(result * 0x1000058b91b5bc9aen, FixMath.precision);
      }
      if ((x & 0x400000000000n) > 0n) {
        result = rshift(result * 0x100002c5c89d5ec6dn, FixMath.precision);
      }
      if ((x & 0x200000000000n) > 0n) {
        result = rshift(result * 0x10000162e43f4f831n, FixMath.precision);
      }
      if ((x & 0x100000000000n) > 0) {
        result = rshift(result * 0x100000b1721bcfc9an, FixMath.precision);
      }
      if ((x & 0x80000000000n) > 0n) {
        result = rshift(result * 0x10000058b90cf1e6en, FixMath.precision);
      }
      if ((x & 0x40000000000n) > 0n) {
        result = rshift(result * 0x1000002c5c863b73fn, FixMath.precision);
      }
      if ((x & 0x20000000000n) > 0n) {
        result = rshift(result * 0x100000162e430e5a2n, FixMath.precision);
      }
      if ((x & 0x10000000000n) > 0) {
        result = rshift(result * 0x1000000b172183551n, FixMath.precision);
      }
      if ((x & 0x8000000000n) > 0n) {
        result = rshift(result * 0x100000058b90c0b49n, FixMath.precision);
      }
      if ((x & 0x4000000000n) > 0n) {
        result = rshift(result * 0x10000002c5c8601ccn, FixMath.precision);
      }
      if ((x & 0x2000000000n) > 0n) {
        result = rshift(result * 0x1000000162e42fff0n, FixMath.precision);
      }
      if ((x & 0x1000000000n) > 0n) {
        result = rshift(result * 0x10000000b17217fbbn, FixMath.precision);
      }
      if ((x & 0x800000000n) > 0n) {
        result = rshift(result * 0x1000000058b90bfcen, FixMath.precision);
      }
      if ((x & 0x400000000n) > 0n) {
        result = rshift(result * 0x100000002c5c85fe3n, FixMath.precision);
      }
      if ((x & 0x200000000n) > 0n) {
        result = rshift(result * 0x10000000162e42ff1n, FixMath.precision);
      }
      if ((x & 0x100000000n) > 0) {
        result = rshift(result * 0x100000000b17217f8n, FixMath.precision);
      }
      if ((x & 0x80000000n) > 0n) {
        result = rshift(result * 0x10000000058b90bfcn, FixMath.precision);
      }
      if ((x & 0x40000000n) > 0n) {
        result = rshift(result * 0x1000000002c5c85fen, FixMath.precision);
      }
      if ((x & 0x20000000n) > 0n) {
        result = rshift(result * 0x100000000162e42ffn, FixMath.precision);
      }
      if ((x & 0x10000000n) > 0n) {
        result = rshift(result * 0x1000000000b17217fn, FixMath.precision);
      }
      if ((x & 0x8000000n) > 0n) {
        result = rshift(result * 0x100000000058b90c0n, FixMath.precision);
      }
      if ((x & 0x4000000n) > 0n) {
        result = rshift(result * 0x10000000002c5c860n, FixMath.precision);
      }
      if ((x & 0x2000000n) > 0) {
        result = rshift(result * 0x1000000000162e430n, FixMath.precision);
      }
      if ((x & 0x1000000n) > 0) {
        result = rshift(result * 0x10000000000b17218n, FixMath.precision);
      }
      if ((x & 0x800000n) > 0) {
        result = rshift(result * 0x1000000000058b90cn, FixMath.precision);
      }
      if ((x & 0x400000n) > 0n) {
        result = rshift(result * 0x100000000002c5c86n, FixMath.precision);
      }
      if ((x & 0x200000n) > 0n) {
        result = rshift(result * 0x10000000000162e43n, FixMath.precision);
      }
      if ((x & 0x100000n) > 0n) {
        result = rshift(result * 0x100000000000b1721n, FixMath.precision);
      }
      if ((x & 0x80000n) > 0n) {
        result = rshift(result * 0x10000000000058b91n, FixMath.precision);
      }
      if ((x & 0x40000n) > 0n) {
        result = rshift(result * 0x1000000000002c5c8n, FixMath.precision);
      }
      if ((x & 0x20000n) > 0n) {
        result = rshift(result * 0x100000000000162e4n, FixMath.precision);
      }
      if ((x & 0x10000n) > 0n) {
        result = rshift(result * 0x1000000000000b172n, FixMath.precision);
      }
      if ((x & 0x8000n) > 0n) {
        result = rshift(result * 0x100000000000058b9n, FixMath.precision);
      }
      if ((x & 0x4000n) > 0n) {
        result = rshift(result * 0x10000000000002c5dn, FixMath.precision);
      }
      if ((x & 0x2000n) > 0n) {
        result = rshift(result * 0x1000000000000162en, FixMath.precision);
      }
      if ((x & 0x1000n) > 0n) {
        result = rshift(result * 0x10000000000000b17n, FixMath.precision);
      }
      if ((x & 0x800n) > 0n) {
        result = rshift(result * 0x1000000000000058cn, FixMath.precision);
      }
      if ((x & 0x400n) > 0n) {
        result = rshift(result * 0x100000000000002c6n, FixMath.precision);
      }
      if ((x & 0x200n) > 0n) {
        result = rshift(result * 0x10000000000000163n, FixMath.precision);
      }
      if ((x & 0x100n) > 0n) {
        result = rshift(result * 0x100000000000000b1n, FixMath.precision);
      }
      if ((x & 0x80n) > 0n) {
        result = rshift(result * 0x10000000000000059n, FixMath.precision);
      }
      if ((x & 0x40n) > 0n) {
        result = rshift(result * 0x1000000000000002cn, FixMath.precision);
      }
      if ((x & 0x20n) > 0n) {
        result = rshift(result * 0x10000000000000016n, FixMath.precision);
      }
      if ((x & 0x10n) > 0n) {
        result = rshift(result * 0x1000000000000000bn, FixMath.precision);
      }
      if ((x & 0x8n) > 0n) {
        result = rshift(result * 0x10000000000000006n, FixMath.precision);
      }
      if ((x & 0x4n) > 0n) {
        result = rshift(result * 0x10000000000000003n, FixMath.precision);
      }
      if ((x & 0x2n) > 0n) {
        result = rshift(result * 0x10000000000000001n, FixMath.precision);
      }
      if ((x & 0x1n) > 0n) {
        result = rshift(result * 0x10000000000000001n, FixMath.precision);
      }
  
      // We're doing two things at the same time:
      //
      //   1. Multiply the result by 2^n + 1, where "2^n" is the integer part and the one is added to account for
      //      the fact that we initially set the result to 0.5. This is accomplished by subtracting from 191
      //      rather than 192.
      //   2. Convert the result to the unsigned 60.18-decimal fixed-point format.
      //
      // This works because 2^(191-ip) = 2^ip / 2^191, where "ip" is the integer part "2^n".
      result = lshift(result, FixMath.precision);
      result = result >> (191n - rshift(x, FixMath.precision));
      return result;
    }
  
    /**
    * Accepts and returns scaled by 2**64 (64-bit fixed-point number).
    */
   @method()
    static  exp(x: bigint) : bigint {
      if (x > 2454971259878909673472n || x < -764553562531197616128n) {
        // Max value is 133.084258667509499441
        // Min value is -41.446531673892822322
        assert(false);
      }
  
      return FixMath.exp2(rshift(x * FixMath.log2e, FixMath.precision));
    }
  
    @method()
    static log(x: bigint) : bigint {
      return FixMath.log2(x) * FixMath.ln2 / FixMath.scale;
    }
  
    @method()
    static log10(x : bigint) : bigint {
      return FixMath.log2(x) * FixMath.ln10 / FixMath.scale;
    }
  
    /**
    * Finds the zero-based index of the first one in the binary representation of x.
    * Accepts numbers scaled by 2**64 (64-bit fixed-point number).
    * Adapted from https://github.com/paulrberg/prb-math
    */

    @method()
    static mostSignificantBit(x : bigint) : bigint {
      let msb : bigint = 0n;
  
      if (x >= 340282366920938463463374607431768211456n) {
        // 2^128
        x = rshift(x, 128n);
        msb += 128n;
      }
      if (x >= 18446744073709551616n) {
        // 2^64
        x = rshift(x, FixMath.precision);
        msb += FixMath.precision;
      }
      if (x >= 4294967296n) {
        // 2^32
        x = rshift(x, 32n);
        msb += 32n;
      }
      if (x >= 65536n) {
        // 2^16
        x = rshift(x, 16n);
        msb += 16n;
      }
      if (x >= 256n) {
        // 2^8
        x = rshift(x, 8n);
        msb += 8n;
      }
      if (x >= 16n) {
        // 2^4
        x = rshift(x, 4n);
        msb += 4n;
      }
      if (x >= 4n) {
        // 2^2
        x = x >> 2n;
        msb += 2n;
      }
      if (x >= 2n) {
        // 2^1
        // No need to shift x any more.
        msb += 1n;
      }
  
      return msb;
    }
  
    /**
    * Calculates the binary logarithm of x.
    * Accepts and returns scaled by 2**64 (64-bit fixed-point number).
    * Only works for x greater then 1 << 64 (log2(1)).
    * Adapted from https://github.com/paulrberg/prb-math
    */
   @method()
    static log2(x: bigint) : bigint {
      if (x < FixMath.scale) {
        assert(false);
      }
  
      // Calculate the integer part of the logarithm and add it to the result and finally calculate y = x * 2^(-n).
     let n = FixMath.mostSignificantBit(x / FixMath.scale);
  
      // The integer part of the logarithm as a signed 59.18-decimal fixed-point number. The operation can't overflow
      // because n is maximum 255, scale is 1e18 and sign is either 1 or -1.
      let result = n * FixMath.scale;
  
      // This is y = x * 2^(-n).
      let y = rshift(x, n);
  
      // If y = 1, the fractional part is zero.
      if (y != FixMath.scale) {
  
        // Calculate the fractional part via the iterative approximation.
        // The "delta >>= 1" part is equivalent to "delta /= 2", but shifting bits is faster.
        for (let i = 0n; i < 64; i ++) {
          y = (y * y) / FixMath.scale;
  
          // Is y^2 > 2 and so in the range [2,4)?
          if (y >= lshift(FixMath.scale, 1n)) {
            // Add the 2^(-m) factor to the logarithm.
            let delta = rshift(FixMath.scale, (i + 1n));
            result += delta;
  
            // Corresponds to z/2 on Wikipedia.
            y = rshift(y, 1n);
          }
        }
      }
      return result;
    }
  
    @method()
    static sqrt(x: bigint) : bigint {
      return FixMath.exp2(FixMath.log2(x) / 2n);
    }
  
    @method()
    static  root(x: bigint, base: bigint) : bigint {
      return FixMath.exp2((lshift(FixMath.log2(x), FixMath.precision) / base));
    }
  
    @method()
    static pow(base : bigint, exp : bigint) : bigint {
    return FixMath.exp2(rshift((exp * FixMath.log2(base)), (FixMath.precision)));
    }
  
  }