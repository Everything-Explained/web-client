


export class InputSpellcheck {


  private _checkList = {
    '(^teh\\s|\\steh\\s)|(^hte\\s|\\shte\\s)': 'the',
    '^int he\\s|\\sint he\\s': 'in the',
    '^yoru\\s|\\syoru\\s': 'your',
    '^adn\\s|\\sadn\\s': 'and',
    '^hwo\\s|\\shwo\\s': 'how',
    '\\si\\s': 'I',
    "i'": "I'",
    '^its\\s|\\sits\\s': "it's",
    '^u\\s|\\su\\s': 'you',
    '^heres\\s|\\sheres\\s': "here's",
    '^dont\\s|\\sdont\\s': "don't",
    '^wont\\s|\\swont\\s': "won't",
    '^theres\\s|\\stheres\\s': "there's",
  } as {[key: string]: string};


  constructor() {}

  public check(str: string) {

    let original = str;

    for (let i in this._checkList) {

      let result = new RegExp(i, 'g').exec(str);
      if (!result) continue;

      let word = result[0]
        , wordLen = word.length
      ;

      if (word.charCodeAt(0) == 32 || word.charCodeAt(0) == 160) {
        let wordFix =
          (word[wordLen - 1].charCodeAt(0) == 32 || word[wordLen - 1].charCodeAt(0) == 160)
            ? `&nbsp;${this._checkList[i]}&nbsp;`
            : `&nbsp;${this._checkList[i]}`
        ;
        str = str.replace(word, wordFix);
      }
      else {
        let wordFix =
          (word[wordLen - 1].charCodeAt(0) == 160)
            ? `${this._checkList[i]}&nbsp;`
            : this._checkList[i]
        ;

        str = str.replace(word, wordFix);
      }
    }

    // Only capitalize on more than one word and non-links
    if (str.split('\s')[1]){
      if (str.toLowerCase().indexOf('http') != 0)
        str = str[0].toUpperCase() + str.substr(1);
    }


    return (original == str) ? null : str;
  }


}