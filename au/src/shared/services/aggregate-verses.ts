
export interface IRawScriptures {
  book: string;
  notation: string;
  chapters: {
    num?: string;
    text: string;
    verse: string;
    title?: string;
  }[];
}

export interface IScriptures {
  book: string;
  notation: string;
  chapters: IChapter[];
}

export interface IChapter {
  num: string;
  verses: {
    title: string;
    num: string;
    text: string;
  }[];
}

export interface IVerse {
  title: string;
  num: string;
  text: string;
}

export function aggregateVerses(bible: IRawScriptures) {

  let book = bible.book
    , notation = bible.notation
    , bibleObj = {
        book,
        notation,
        chapters: [] as IChapter[]
      }
    , chapterTrack = ''
    , titleTrack = null
    , chapter = {
        num: '',
        verses: [] as IVerse[]
      }
    , firstIteration = true
  ;


  for (let chap of bible.chapters) {
    if (chap.num && chap.num != chapterTrack) {
      if (!firstIteration) bibleObj.chapters.push({
        num: chapterTrack,
        verses: chapter.verses.slice()
      });
      chapterTrack = chapter.num = chap.num;
      titleTrack = chap.title || null;
      firstIteration = false;
      chapter.verses = [];
    }
    chapter.verses.push({
      title: chap.title || null,
      num: chap.verse,
      text: chap.text
    });
  }
  bibleObj.chapters.push({
    num: chapterTrack,
    verses: chapter.verses.slice()
  });


  return bibleObj;

}