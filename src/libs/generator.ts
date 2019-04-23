// let mtime = require('microtime');
let debug = require('debug')('nou:generator');

interface IEncodeOptions {
  nick: string;
  hours: number;
  keys: number[];
}


interface ITimeUnits {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}


export class Generator {
  public base62Table: string[] = [];

  constructor() {
    for (let i = 0; i < 62; i++) {
      let diff = (i > 9)
            ? ((i > 35) ? 61 : 55)
            : 48;

      this.base62Table.push(String.fromCharCode(i + diff));
    }
  }

  public toBase36(decimal: number) {
    return this.decToBase(decimal, 36);
  }


  // TODO: Tests should test as many bases as possible
  public decToBase(decimal: number, base: number) {

    if (base > this.base62Table.length)
      throw new Error(`Generator::Base ${base} is not supported.`);

    let b = 0
      , x = '';

    while (!(decimal < 1)) {

      let r = Math.floor(decimal % base);
      x = this.base62Table[r] + x;
      decimal /= base;

    }
    return x;

  }

  // TODO: Write tests for all possible bases
  public baseToDec(n: string, base: number) {

    let supported = base <= 62;

    if (!supported)
      throw new Error(`Generator::Base ${base} is not supported.`)
    ;

    if (base == 36 || base == 16) {
      n = n.toUpperCase();
    }

    let pow = n.length - 1
      , digits: number[] = []
      , x = 0
    ;

    for (let d = 0; d < n.length; d++) {
      if (!parseInt(n[d])) {
        for (let i = 0; i < this.base62Table.length; i++) {
          if (this.base62Table[i] == n[d]) {
            digits.push(i);
            break;
          }
        }
        continue;
      }
      digits.push(parseInt(n[d]));
    }

    for (let d = 0; d < digits.length; d++) {
      x += digits[d] * Math.pow(base, pow--);
    }
    return x;

  }


  public b36ToDec(n: string) {

    return this.baseToDec(n, 36);

  }


  public toTimeUnits(milliseconds: number) {
    let seconds = milliseconds / 1000
      , minutes = seconds / 60
      , hours   = minutes / 60
      , days    = hours / 24
    ;

    return {
      milliseconds,
      seconds,
      minutes,
      hours,
      days
    };
  }

  public hoursToTU(hours: number) {
    return this.toTimeUnits(hours * 60 * 60 * 1000);
  }

  public secondsToTU(seconds: number) {
    return this.toTimeUnits(seconds * 1000);
  }

  public daysToTU(days: number) {
    return this.toTimeUnits(days * 24 * 60 * 60 * 1000);
  }


  public jumbleString(str: string) {

    let strArray = str.split('')
      , randomStr = '';

    while (strArray.length) {
      let pos = Math.floor(Math.random() * strArray.length);
      randomStr += strArray.splice(pos, 1)[0];
    }

    return randomStr;

  }

  public randomBase36(length: number) {
    let str = '';

    while (length--) {
      str += this.base62Table[Math.ceil(Math.random() * 35)];
    }

    return str;
  }

  public randomStr(length: number) {
    let str = '';

    while(length--) {
      str += this.base62Table[Math.floor(Math.random() * 62)];
    }

    return str;
  }


  public randomRange(min: number, max: number) {
    const calc = Math.ceil(Math.random() * max);
    if (calc < min) return calc + min;
    return calc;
  }


  /**
   * Generate a random number or series of random numbers.
   *
   * @param range The highest random number possible
   * @param amount How many numbers to generate
   * @param unique Will create a series of unique (not repeating) random numbers
   *               based on the amount (how many) to create.
   */
  public randomNumberStr(range: number, amount = 0, unique = false) {

    let returnSeq = ''
      , separator = (range > 9) ? ',' : '';

    if (unique && !amount)
      throw new Error('Generator::Unique numbers require an amount');

    if (unique && amount > range)
      throw new Error('Generator::The amount cannot exceed the range of unique numbers');

    if (unique) {
      let seq: number[] = [];
      for (let i = 1; i < range + 1; i++) {
        seq.push(i);
      }

      while (returnSeq.split(separator).length <= amount) {
        let pos = Math.floor(Math.random() * seq.length);
        returnSeq += seq.splice(pos, 1)[0] + separator;
      }
    }

    if (amount && !unique) {
      for (let i = 0; i < amount; i++) {
        returnSeq += Math.ceil(Math.random() * range) + separator;
      }
    }


    return (amount || unique)
              ? ((separator)
                ? returnSeq.slice(0, -1)
                : returnSeq)
              : Math.ceil(Math.random() * range).toString();
  }


}


