import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MiniModal } from './libs/minimodal';
import Markdown from 'markdown-it';
import moment from 'moment';
import dataImages from './assets/data-images.json';
import setupMarkdown from './setup/markdown';
import ClientAPI from 'client-api';
import { SessionData } from './api/server';

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

const api = new ClientAPI();

Vue.filter('dateFormat', (v: unknown, format?: string) => {
  if (!v) return;
  if (typeof v == 'string' || v instanceof Date) {
    return moment(v).format(format || 'MMMM Do, YYYY');
  }
  throw new Error('DateFormat only accepts strings or Date objects');
});

Vue.use({
  install: () => {
    Vue.prototype.$modal = new MiniModal();
    Vue.prototype.$dataImages = dataImages;
    Vue.prototype.$markdown = setupMarkdown();
    Vue.prototype.$api = api;
    Vue.prototype.$debounce =
      (fn: (...args: any) => any, delay = 0) => {
        let timeoutID = 0;
        return function() {
          return {
            exec: (...args) => {
              clearTimeout(timeoutID);
              return new Promise(rs => {
                timeoutID = setTimeout(function() {
                  rs(fn(...args))
                }, delay);
              });
            },
            cancel: () => {
              clearTimeout(timeoutID);
            }
          }
        }
      }
  }
})


async function initVue() {
  // Vue relies on session data
  await api.initSession();
  if (cookies && !needBrowser) {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
}
initVue();



