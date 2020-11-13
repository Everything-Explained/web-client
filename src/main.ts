import Vue, { createApp } from 'vue';
import App from './App.vue';
import router from './router';




const getElement = (id: string) => {
  return document.getElementById(id) as HTMLElement;
};


const browserIsSupported = (() => {
  const isValidBrowser =
       navigator.cookieEnabled != undefined
    || window['Promise']
    || window['DOMParser']
    || document.body.dataset
    || (new DOMParser()).parseFromString
    || document.importNode
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
