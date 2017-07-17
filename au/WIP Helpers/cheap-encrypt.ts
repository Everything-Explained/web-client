module CheapEncrypt {

  let
    // Encoding starts @ASCII:32
    offset = 32

    // Encoding loops @ASCII:126
    , limit = 126

    // Number of available chars to encode to/from
    , chars = 94

    // Ratio to ramp circular reference char codes
    , seedRamp = 0.7;



  export function encode(keys: string, dataStr: string) {


    if (!/^([0-9]{1,3}\,)+[0-9]{1,3}$/g.test(keys)) {
      console.log('Invalid Encode Key');
      return;
    }

    let keyNums = parseKeys(keys)
      , encodedStr = '';


    let i = 0;
    for (let c of dataStr) {

      i = (i < keyNums.length) ? i : 0;
      let pos = c.charCodeAt(0) + keyNums[i++];

      if (pos > limit) {
        encodedStr += String.fromCharCode((pos - limit) + offset);
      } else {
        encodedStr += String.fromCharCode(pos);
      }
    }


    return encodedStr;
  }





  export function parseKeys(keyStr: string) {

    let keyNums = [] as number[]
      , keys = keyStr.split(',')

      // Seeds circular reference 0/94
      , seed: number;


    if (keys.length < 4) {
      throw new Error('You must provide at least 3 keys and a seed');
    }

    // Seed is the last specified key
    seed = parseInt(keys.splice(-1)[0]);

    if (seed < 11 || seed >= chars) {
      throw new Error('Seed must be greater than 10 and less than ' + chars);
    }


    for (var k of keys) {

      let x = parseInt(k)

        // Remainder when key exceeds character length
        , r = chars * Math.floor(x / chars);


      if (x >= chars) {
        let d = x - r;
        if (d == chars || d == 0) {
          // Make each seed unique
          seed = Math.floor(seed * seedRamp);
          keyNums.push(chars - seed);

        } else {

          keyNums.push(d);

        }
      }
      else {
        keyNums.push(x);
      }


    }

    return keyNums;
  }


}

export = CheapEncrypt;