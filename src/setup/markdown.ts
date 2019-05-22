import Markdown from 'markdown-it';
import Vue from 'vue';

const md = new Markdown({
  xhtmlOut: true,
  breaks: true,
  typographer: true,
  quotes: '“”‘’',
  linkify: true,
});
md.use(require('markdown-it-deflist'));


function setLinkTargetBlank() {
  let defaultLinkRenderer =
    md.renderer.rules.link_open ||
    function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    let link = tokens[idx]!.attrGet('href')!.toLowerCase();
    if (~link.indexOf('http')) {
      tokens[idx].attrPush(['target', '_blank']); // Add new attribute
    }

    return defaultLinkRenderer(tokens, idx, options, env, self);
  };
}


export default function setupMarkdown() {

  setLinkTargetBlank();

  Vue.filter('markdown', (v: unknown) => {
    if (!v) return '';
    if (typeof v == 'string') {
      return md.render(v);
    }
    throw new Error('Markdown only accepts string values');
  });

  return md;
}