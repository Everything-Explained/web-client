

export class MarkdownValueConverter {
  toView(val: string) {
    let md = window['markdownit'];
    if (!md) {
      console.warn('Markdown Not Loaded');
      return val;
    }

    if (!md.render) {
      md = md({breaks: true});
    }

    let html = md.render(val);
    // Force all links into new window/tab
    html = html.replace(/\<a\s/g, '<a target="_blank" ');
    // Force all PRE (code) elements into P (Paragraph) elements
    html = html.replace(/\<pre\>/g, '<div class="code"><pre>');
    html = html.replace(/\<\/pre\>/g, '</pre></div>');
    return html;
  }
}