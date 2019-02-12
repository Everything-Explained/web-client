import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MiniModal } from './libs/minimodal';
import Markdown from 'markdown-it';
import moment from 'moment';
import dataImages from './assets/data-images.json';


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

// Component.registerHooks([
//   'beforeRouteEnter',
//   'beforeRouteLeave',
//   'beforeRouteUpdate',
// ]);

const md = new Markdown();
Vue.filter('markdown', (v: unknown) => {
  if (!v) return '';
  if (typeof v == 'string') {
    return md.render(v);
  }
  throw new Error('Markdown only accepts string values');
});


Vue.filter('dateFormat', (v: unknown, format?: string) => {
  if (!v) return;
  if (typeof v == 'string' || v instanceof Date) {
    return moment(v).format(format || 'MMMM Do, YYYY');
  }
  throw new Error('DateFormat only accepts string values');
});


Vue.use({
  install: () => {
    Vue.prototype.$modal = new MiniModal();
    Vue.prototype.$dataImages = dataImages;
  }
})


if (cookies && !needBrowser) {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}


