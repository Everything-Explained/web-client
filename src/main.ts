import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MiniModal } from './libs/minimodal';
import Markdown from 'markdown-it';

Vue.config.productionTip = false

// ######################################################
// #region BEGIN BROWSER CHECK
let needBrowser =
  !(typeof navigator['cookieEnabled'] == 'boolean') ||
  !window['Promise'] ||
  !window['DOMParser'] ||
  !document.body.dataset ||
  !new DOMParser()['parseFromString'] ||
  !document['importNode']
;

let cookies = navigator.cookieEnabled || false;


if (needBrowser) {
  let obj = document.getElementById('Failure') as HTMLElement;
  obj.style.display = 'inline-block';
}

if (!cookies) {
  let obj = document.getElementById('NoCookies') as HTMLElement;
  obj.style.display = 'inline-block';
}
// #endregion
// #######################################################

const md = new Markdown();
Vue.filter('markdown', (v: unknown) => {
  if (!v) return '';
  if (typeof v == 'string') {
    return md.render(v);
  }
  throw new Error('Markdown only accepts string values');
});


Vue.use({
  install: () => {
    Vue.prototype.$modal = new MiniModal()
  }
})

if (cookies && !needBrowser) {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}


