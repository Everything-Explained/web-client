
export interface IRawScriptures {
  book: string;
  notation: string;
  scriptures: {
    chapter?: string;
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

export function aggregateVerses(scriptureList: IRawScriptures) {

  let book = scriptureList.book
    , notation = scriptureList.notation
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
    , firstIteration = true;


  for (let s of scriptureList.scriptures) {
    if (s.chapter && s.chapter != chapterTrack) {
      if (!firstIteration) bibleObj.chapters.push({
        num: chapterTrack,
        verses: chapter.verses.slice()
      });
      chapterTrack = chapter.num = s.chapter;
      titleTrack = s.title || null;
      firstIteration = false;
      chapter.verses = [];
    }
    chapter.verses.push({
      title: s.title || null,
      num: s.verse,
      text: s.text
    });
  }
  bibleObj.chapters.push({
    num: chapterTrack,
    verses: chapter.verses.slice()
  });


  return bibleObj;

}