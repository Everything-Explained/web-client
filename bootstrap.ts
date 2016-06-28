

let needBrowser = !navigator['cookieEnabled'] &&
                  !window['Promise'] &&
                  !window['DOMParser'] &&
                  !document.body.dataset &&
                  !new DOMParser()['parseFromString'] &&
                  !document['importNode'];

let cookiesEnabled = navigator.cookieEnabled || undefined;

let scripts = [] as HTMLScriptElement[];

function initScripts() {

  if (!scripts.length) {
    if (!window['System']) {
      let obj = document.getElementById('failure');
      obj.style.display = 'inline-block';
      return;
    }
    System.import('aurelia-bootstrapper');
    return;
  }

  let obj = scripts.shift();
  obj.src = obj.dataset['src'];
  obj.async = false;
  obj.onload = initScripts;

}

if (needBrowser) {
  let obj = document.getElementById('failure');
  obj.style.display = 'inline-block';
}

if (cookiesEnabled && !needBrowser) {

  scripts =
      Array.prototype.slice.call(document.querySelectorAll('script')) as HTMLScriptElement[];

  scripts = scripts.filter(v => {
    return !!v.dataset['src'];
  });

  initScripts();


}


if (!cookiesEnabled && !needBrowser) {
  let obj = document.getElementById('cookie');
  obj.style.display = 'inline-block';
}