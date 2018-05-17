
import {Router, NavModel, RouterConfiguration, RouteConfig } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Login} from './shared/services/auth-service';
import {Session} from './shared/models/session';
import {MiniModal} from './shared/utilities/minimodal';


@inject(Element, EventAggregator, MiniModal, Login, Session)
export class App {

  public watermark = {
    version: '36',
    class: 'α',
    title: 'α36',
    desc: `
      We shall carry on by 12's until we reach β;
      a shift from the arbitrary past into the ever
      present - a gift to Me, Myself, and I.
    `
  };

  router: Router;

  private _miniModal: MiniModal;

  private _modalOverlay: HTMLElement;


  constructor(private elem:     Element,
              private _eva:     EventAggregator,
              private _modal:   MiniModal,
              private _login:   Login,
              private _session: Session) { }


  /** Aurelia router configuration */
  configureRouter(config: RouterConfiguration, router: Router) {
    // this.createRoutes(this.mainMenu, config);
    this.router = router;
    config.title = 'Noumenae';

    let routes = [];

    routes.push([
      {route: '', redirect: 'home'},
      {
        route: 'home', name: 'home',
        moduleId: 'components/home/home', nav: true
      },
      {
        route: ['changelog', 'changelog/:page'],
        name: 'changelog',
        moduleId: 'components/changelog/changelog', nav: true
      }
    ]);

    if (!this._session.authed) {
      routes.push({
        route: 'invite',
        name: 'invite',
        moduleId: 'components/invites/invites', nav: true
      });
      routes.push({
        route: 'signin',
        name: 'signin',
        moduleId: 'components/auth/signin', nav: true
      });
      routes.push({route: 'settings', redirect: 'signin'});
    }
    else {
      routes.push({
        route: 'chat',
        name: 'chat',
        moduleId: 'components/chat/chat', nav: true
      });
      routes.push({
        route: 'settings',
        name: 'settings',
        moduleId: 'components/auth/settings', nav: true
      });
      routes.push({route: 'signin', redirect: 'settings'});
    }

    config.map(routes);


    this.router.handleUnknownRoutes({
      route: '',
      moduleId: './components/error/F404'
    });
  }



  // lightsOnOff(ev: MouseEvent) {


  //   if (ev.button == 0) {

  //     if (this.lightsOnTimeout) return;
  //     this.lightsOnTimeout = true;

  //     let obj = <HTMLElement>ev.target
  //       , transition = document.createElement('style')
  //       , timeoutSpeed = 750;

  //     let transHTML =
  //       '<style id="Transition">' +
  //       '* { transition: all .5s !important; }' +
  //       '</style>';

  //     $('head')[0].insertAdjacentHTML('afterbegin', transHTML);

  //     if (obj.classList.contains('light')) {
  //       localStorage.setItem('lights', 'off');
  //       obj.classList.remove('light');
  //       obj.classList.add('dark');
  //       $('#Theme')[0].setAttribute('href', '../css/themes/dark/theme.css');
  //       this.lightsTimeout = setTimeout(() => {
  //         $('head')[0].removeChild($('#Transition')[0]);
  //         this.lightsOnTimeout = false;
  //       }, timeoutSpeed);

  //     }
  //     else {
  //       localStorage.setItem('lights', 'on');
  //       obj.classList.remove('dark');
  //       obj.classList.add('light');
  //       $('#Theme')[0].setAttribute('href', '../css/themes/light/theme.css');
  //       this.lightsTimeout = setTimeout(() => {
  //         $('head')[0].removeChild($('#Transition')[0]);
  //         this.lightsOnTimeout = false;
  //       }, timeoutSpeed);
  //     }
  //   }

  // }






  // get lights() {
  //   return localStorage.getItem('lights') == 'on';
  // }

  public openWatermark() {
    this._modal.show('VersionModal');
  }


  /** DOM Ready (Called by Aurelia) */
  attached() {

    // let req = new XMLHttpRequest()
    //   , lights = localStorage.getItem('lights');


    // let sse = new EventSource('/internal/sse');

    // sse.addEventListener('open', (e) => {
    //   console.log('Connected');
    // });

    // sse.addEventListener('error', (e) => {
    //   console.error(e);
    // });

    // sse.addEventListener('message', (e) => {
    //   console.log(e.data);
    // });


    // let light = (lights == 'off') ? 'light' : 'dark';
    // req.open('GET', `css/themes/${light}/theme.css`, true);
    // req.send();

  }


}
