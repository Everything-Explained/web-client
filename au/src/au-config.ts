import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {Web} from './helpers/web';

//Configure Bluebird Promises.
(<any>Promise).config({
  longStackTraces: environment.debug,
  warnings: false
});

let needBrowser =
      !(typeof navigator['cookieEnabled'] == 'boolean') ||
      !window['Promise'] ||
      !window['DOMParser'] ||
      !document.body.dataset ||
      !new DOMParser()['parseFromString'] ||
      !document['importNode']

  , cookiesEnabled = navigator.cookieEnabled || undefined

  , scripts = [] as HTMLScriptElement[]
;


export function configure(aurelia: Aurelia) {


  if (!cookiesEnabled && !needBrowser) {
    let obj = document.getElementById('cookie');
    obj.style.display = 'inline-block';
    return;
  }

  if (needBrowser) {
    let obj = document.getElementById('failure');
    obj.style.display = 'inline-block';
    return;
  }

  Web.GET('/internal/session', {}, (err, code, data) => {
    if (err) {
      console.error(err);
      return;
    }

    window.session = data;

    aurelia.use
      .standardConfiguration()
      .feature('resources');

    if (environment.debug) {
      aurelia.use.developmentLogging();
    }

    if (environment.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(() => aurelia.setRoot())
  });



}
