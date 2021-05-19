/* eslint-disable */
import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import vuex from './vuex/vuex-store';
import './styles/_main.css';
import { useAPI } from './services/api_internal';


// Initialize API
const api = useAPI();
api.init();


const getElement = (id: string) => {
  return document.getElementById(id)!;
};


const browserIsSupported = (() => {
  const isValidBrowser =
       navigator.cookieEnabled != undefined
    && window['Promise']
    && window['DOMParser']
    && window['crypto']
    && document.body.dataset
    && (new DOMParser()).parseFromString
    && document.importNode
  ;
  if (!isValidBrowser) {
    const el: HTMLElement = getElement('Failure');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


const cookiesAreEnabled = (() => {
  if (!navigator.cookieEnabled) {
    const el: HTMLElement = getElement('NoCookies');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


if (cookiesAreEnabled && browserIsSupported) {
  window['app'] = createApp(App)
    .use(vuex)
    .use(router)
    .mount('#app')
  ;
}
