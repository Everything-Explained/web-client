import {WordType} from './message-view';

export class BibleVerseFilter {

  // Aliased books of the Bible
  abooks = '^(gen|exo|lev|num|deu|jos|jud' +
            '|rut|ezr|neh|est|job|psa|pro' +
            '|ecc|sos|isa|jer|lam|eze|dan' +
            '|hos|joe|amo|oba|jon|mic|nah' +
            '|hab|zep|hag|zec|mal|mat|mar' +
            '|luk|joh|act|rom|gal|eph|phi' +
            '|tit|phile|heb|jam|jud|rev)$';

    // Full books of the bible
  books = '^(genesis|exodus|leviticus|numbers' +
          '|deuteronomy|joshua|judges|ruth' +
          '|1samuel|2samuel|1kings|2kings' +
          '|1chronicles|2chronicles|ezra' +
          '|nehemiah|esther|job|psalms|proverbs' +
          '|ecclesiastes|song of solomon|isaiah' +
          '|jeremiah|lamentations|ezekiel|daniel' +
          '|hosea|joel|amos|obadiah|jonah|micah' +
          '|nahum|habakkuk|zephaniah|haggai' +
          '|zechariah|malachi|matthew|mark' +
          '|luke|john|acts|romans|1corinthians' +
          '|2corinthians|galatians|ephesians' +
          '|philippians|colossians' +
          '|1thessalonians|2thessalonians' +
          '|1timothy|2timothy|titus|philemon' +
          '|hebrews|james|1peter|2peter' +
          '|1john|2john|3john|jude' +
          '|revelation)$';

  chapverse = '(^[0-9]{1,2}|^[0-9]{1,2}:[0-9]{1,2})(\-[0-9]{1,2})?$';


  constructor() {}


  filter(content: string) {
    let book = null
      , words = content.replace(/\>|\</g, ' ').split(' ')
      , matches = null
      , verses = []
      , wordlist = [] as string[]
      , result = []
    ;

    // Make sure we have something to test
    if (words.length < 2) return [];
    if (!words[1].length) return [];

    for (let word of words) {

      if (book) {
        if (!/^[0-9]/.test(word)) {
          book = null;
          continue;
        }

        if (word.indexOf(';') > -1) {

          let parts = word.split(';')
            , text = '';

          for (let part of parts) {
            let validate = new RegExp(this.chapverse);
            if (matches = validate.exec(part)) {
              text += matches[0] + ';';
            }
          }
          wordlist.push(book + ' ' + text.substr(0, text.length - 1));
        }
        else {
          let validate = new RegExp(this.chapverse);
          if (matches = validate.exec(word)) {
            wordlist.push(book + ' ' + matches[0]);
          }
        }

        // Reset book
        book = null;
        continue;
      }

      let abookEx = new RegExp(this.abooks, 'gi')
        , bookEx = new RegExp(this.books, 'gi')
      ;

      if (abookEx.test(word)) {
        book = word;
        continue;
      }

      if (bookEx.test(word)) {
        book = word;
        continue;
      }

    }

    return wordlist;
  }

}