

let cookiesEnabled = navigator.cookieEnabled || undefined;

let needBrowser = typeof cookiesEnabled === undefined;

let scripts = [
    '../libs/optiscroll.min.js',
    'jspm_packages/system.js',
    'config.js'
  ];

function initScripts() {
  if (!scripts.length) {
    System.import('aurelia-bootstrapper');
    return;
  }
  let obj = document.createElement('script');
  obj.src = scripts.shift();
  document.body.appendChild(obj);
  obj.onload = initScripts;
}

if (cookiesEnabled && !needBrowser) {
    initScripts();
}

if (!cookiesEnabled) {
  let obj = document.getElementById('cookie');
  obj.style.display = 'inline-block';
}