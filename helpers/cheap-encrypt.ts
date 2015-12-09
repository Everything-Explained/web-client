

module CheapEncrypt {
  
  export function encode(keys: string, dataStr: string) {


    if (!/^([0-9]{1,3}\,)+[0-9]{1,3}$/g.test(keys)) {
      console.log('Invalid Encode Key');
      return;
    }


    let keyNums = parseKeys(keys)

      // Encoding starts @ASCII:32
      , offset = 32

      // Encoding loops @ASCII:126
      , limit = 126

      , encodedStr = '';


    let i = 0;
    for(let c of dataStr) {

      i = (i < keyNums.length) ? i : 0;
      let pos = c.charCodeAt(0) + keyNums[i++];

      if (pos > 126) {
        encodedStr += String.fromCharCode((pos - limit) + offset);
      } else {
        encodedStr += String.fromCharCode(pos);
      }
    }


    return encodedStr;
  }




  function parseKeys(keys: string) {

    let keyNums = [] as number[];

    for(var k of keys.split(',')) {
      let x = parseInt(k)

        // Character length
        , l = 94

        // Remainder when key exceeds character length
        , r = l * Math.floor(x / l);

      if (x > l) {
        if (r == 0) keyNums.push(26);
        else keyNums.push(x - r);
      }
      else {
        keyNums.push(x);
      }
    }

    return keyNums;
  }
  
  
}

export = CheapEncrypt

