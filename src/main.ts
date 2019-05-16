import './setup/register-hooks';
import Vue from 'vue'
import App from './App.vue'
import initRouter from './router'
import { MiniModal } from './libs/minimodal';
import dataImages from './assets/data-images.json';
import setupMarkdown from './setup/markdown';
import ClientAPI from './api/mock';
import API from 'client-api';
import Utils from './libs/utils';
import { Timer } from './libs/timer';


Vue.config.productionTip = false

declare global {
  interface Window {
    /** Is client in development mode -
     * **set inside '.env' files** */
    indev: boolean;
  }
}

window.indev = process.env.VUE_APP_ENV == 'development';




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



const api = new API() as ClientAPI;

Vue.filter('dateFormat', (v: unknown, format?: string) => {
  if (!v) return;
  if (typeof v == 'string' || v instanceof Date) {
    if (format == 'log') {
      return Utils.toNumericDate(v).replace(/\//g, '-')
    }
    return Utils.toNormalDate(v);
  }
  throw new Error('DateFormat only accepts strings or Date objects');
});

Vue.use({
  install: () => {
    Vue.prototype.$modal = new MiniModal();
    Vue.prototype.$dataImages = dataImages;
    Vue.prototype.$markdown = setupMarkdown();
    Vue.prototype.$api = api;
    Vue.prototype.$timer = new Timer();
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
  let session = await api.initSession();
  if (cookies && !needBrowser) {

    new Vue({
      router: initRouter(session, api),
      render: h => h(App)
    }).$mount('#app')
  }
}
initVue();



