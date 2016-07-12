export function configure(aurelia) {

  let needBrowser =
        !navigator['cookieEnabled'] ||
        !window['Promise'] ||
        !window['DOMParser'] ||
        !document.body.dataset ||
        !new DOMParser()['parseFromString'] ||
        !document['importNode'];

  let cookiesEnabled = navigator.cookieEnabled || undefined;

  if (needBrowser) {
    let obj = document.getElementById('failure');
    obj.style.display = 'inline-block';
    return;
  }

  if (!cookiesEnabled && !needBrowser) {
    let obj = document.getElementById('cookie');
    obj.style.display = 'inline-block';
    return;
  }

  aurelia.use
    .standardConfiguration()
    .developmentLogging();
  aurelia.start().then(a => a.setRoot());
}