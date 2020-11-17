/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './main.css';


const getElement = (id) => {
  return document.getElementById(id);
};


const browserIsSupported = (() => {
  const isValidBrowser =
       navigator.cookieEnabled != undefined
    && window['Promise']
    && window['DOMParser']
    && document.body.dataset
    && (new DOMParser()).parseFromString
    && document.importNode
  ;
  if (!isValidBrowser) {
    const el = getElement('Failure');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


const cookiesAreEnabled = (() => {
  if (!navigator.cookieEnabled) {
    const el = getElement('NoCookies');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


if (cookiesAreEnabled && browserIsSupported) {
  createApp(App)
    .use(router)
    .mount('#app')
  ;
}
