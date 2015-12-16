
export interface IScriptures {
  title?: string;
  notation?: string;
  bookname: string;
  text: string;
  chapter: string;
  verse: string;
}

export function displayVerse(scripts: IScriptures[]) {

  let book = scripts[0].bookname
    , notation = scripts[0].notation
    , html = '';

  for (let script of scripts) {

    if (script.title) {
      html += `<h2>${script.title}</h2>`;
    }

    html += `<span><b>${script.chapter}:${script.verse}</b>` +
                 `${script.text}</span>`

  }

  let formattedVerse = {
    header: `${book} ${notation}`,
    html
  }

  return formattedVerse;

}