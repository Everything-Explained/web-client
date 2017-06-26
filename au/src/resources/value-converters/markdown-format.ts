

export class MarkdownValueConverter {
  toView(val: string, useHTML: boolean) {
    let md = window['markdownit'];
    if (!md) {
      console.warn('Markdown Not Loaded');
      return val;
    }

    if (!md.render) {
      window['mdHTML'] = md({
        html: true,
        breaks: true,
        typographer: true,
        quotes: '“”‘’'
      });
      md = md({
        breaks: true,
        typographer: true,
        quotes: '“”‘’'
      });
      this._createLinkTargetBlank(md);
      this._createLinkTargetBlank(window['mdHTML']);
      this._createGreekInline(md);
    }

    let html = (useHTML) ? window['mdHTML'].render(val) : md.render(val);
    // Force all PRE (code) elements into P (Paragraph) elements
    html = html.replace(/\<pre\>/g, '<div class="code"><pre>');
    html = html.replace(/\<\/pre\>/g, '</pre></div>');
    return html;
  }



  private _createLinkTargetBlank(md) {

    let defaultLinkRenderer =
      md.renderer.rules.link_open ||
      function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      if (~tokens[idx].attrGet('href').indexOf('http')) {
        let aIndex = tokens[idx].attrIndex('target');
        tokens[idx].attrPush(['target', '_blank']); // Add new attribute
      }

      return defaultLinkRenderer(tokens, idx, options, env, self);
    };
  }



  private _createGreekInline(md) {
    md.inline.ruler.push('custom_inline', (state, silent) => {
      if (silent) return false;
      if (state.src.charCodeAt(state.pos) !== 64) {
        return false;
      }

      let pos = state.pos
        , greekEx = /@(.+)@/g
        , token;
      ;

      if (greekEx.test(state.src)) {

        let match = state.src.match(greekEx)[0].replace(/@/g, '');

        if (!silent) {
          token = state.push('inline_html', 'span', 1);
          token.attrs = [ ['class', 'greek'] ];

          token = state.push('text', '', 0);
          token.content = `${match}`;

          token = state.push('inline_html', 'span', -1);
        }

        state.pos += match.length + 2;
        return true;
      }

      return false;
    });
  }
}