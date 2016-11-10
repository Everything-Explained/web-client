
class IPTools {


  static verifyIp(testIp: string, ipOrRange: string) {

    if (~ipOrRange.indexOf('-')) {
      let ranges = ipOrRange.split(';');

      for (let r of ranges) {
        let [from, to] = r.split('-')
          , constant = IPTools.findConstant(to, from);

        // Store only constant bits
        let entryConst = testIp.split('.', constant).join('.')
          , fromConst = from.split('.', constant).join('.');

        if (entryConst == fromConst) {
          // Convert bits to number array
          let toNums = IPTools.toNum(to.replace(fromConst + '.', ''))
            , fromNums = IPTools.toNum(from.replace(fromConst + '.', ''))
            , entryNums = IPTools.toNum(testIp.replace(fromConst + '.', ''));

          for (let i = 0; i < toNums.length; i++) {
            if ((entryNums[i] <= toNums[i]) && (entryNums[i] >= fromNums[i])) {
              continue;
            }
            return 'Invalid';
          }
          return 'Valid';
        }
      }
      return 'Invalid';
    }
  }

  static toNum(ipConst: string) {
    let results: number[] = []
      , constants = ipConst.split('.');

    constants.forEach(v => {
      results.push(parseInt(v));
    });

    return results;
  }


  static findConstant(to: string, from: string) {
    let toBits = to.split('.')
      , fromBits = from.split('.');

    for (let i = 0; i < toBits.length; i++) {
      if (toBits[i] === fromBits[i]) continue;
      return i;
    }
  }


}