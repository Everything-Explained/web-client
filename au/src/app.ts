
import {Router, NavModel, RouterConfiguration, RouteConfig } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Login} from './shared/services/auth-service';
import {Session} from './shared/models/session';
import {MiniModal} from './shared/utilities/minimodal';


interface PageConfiguration {
  route: NavModel;
}

export interface IRoute {
  name: string;
  routes?: string[];
  redirect?: string;
  page?: string;
  isActive?: boolean;
  tabs?: IRoute[];
  classes?: string;
  hidden?: boolean;
  hasChildren?: boolean;
  isChild?: boolean;
}


@inject(Element, EventAggregator, MiniModal, Login, Session)
export class App {

  version = '48';

  router: Router;

  private _miniModal: MiniModal;

  lightsTimeout = 0;
  lightsOnTimeout = false;

  // page = Page;

  // Currently active navigation routes (Populated)
  activeRoutes = new Array<NavModel>();

  private _modalOverlay: HTMLElement;


  constructor(private elem:          Element,
              private _eva:          EventAggregator,
              private _modal:        MiniModal,
              private _login: Login,
              private _session: Session)
  {

    if (this._session.authed) {

      // Remove invite page
      // this.mainMenu.pop();

      // for (let p of this.mainMenu[0].pages) {
      //   if (p.name.toLowerCase() == 'signin') {
      //     p.hidden = true;
      //   }
      //   if (p.name.toLowerCase() == 'settings') {
      //     p.hidden = false;
      //   }
      //   if (p.name.toLowerCase() == 'blog') {
      //     p.hidden = false;
      //   }
      // }
    }
    else {
      // Remove Chat page
      // this.mainMenu.splice(1, 1);
    }


  }


  /** Aurelia router configuration */
  configureRouter(config: RouterConfiguration, router: Router) {
    // this.createRoutes(this.mainMenu, config);
    this.router = router;
    config.title = 'Noumenae';

    let routes = [];

    routes.push([
      {route: '', redirect: 'home'},
      {route: 'home', name: 'home', moduleId: 'components/home/home', nav: true},
      {route: ['changelog', 'changelog/:page'], name: 'changelog', moduleId: 'components/changelog/changelog', nav: true}
    ]);

    if (!this._session.authed) {
      routes.push({route: 'invite', name: 'invite', moduleId: 'components/invites/invites', nav: true});
      routes.push({route: 'signin', name: 'signin', moduleId: 'components/auth/signin', nav: true});
      routes.push({route: 'settings', redirect: 'signin'});
    }
    else {
      routes.push({route: 'chat', name: 'chat', moduleId: 'components/chat/chat', nav: true});
      routes.push({route: 'settings', name: 'settings', moduleId: 'components/auth/settings', nav: true});
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






  get lights() {
    return localStorage.getItem('lights') == 'on';
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
