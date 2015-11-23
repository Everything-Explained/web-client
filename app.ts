
import {Router, IRouterNavigationRoute, IRoute, IRouterConfig} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Page, PageElement} from './helpers/page';
import {$} from './helpers/domop';

interface IPageConfiguration {
  route: IRouterNavigationRoute;
}

export interface INav {
  name: string;
  pages: string[];
  def: string;
  defRoute?: IRouterNavigationRoute;
  isActive: boolean;
  routes?: IRouterNavigationRoute[];
}


@inject(Element, EventAggregator)
export class App {

  version = '0.4.0';

  router: Router;

  page = Page;

  lightsTimeout = 0;
  lightsOnTimeout = false;

  // Navigation menu list
  navList = [
    {
      name: 'Home',
      pages: ['About', 'Rules', 'Register', 'FAQ'],
      def: 'About',
      isActive: false,
      defRoute: null,
      routes: new Array<IRouterNavigationRoute>()
    },
    {
      name: 'Chat',
      pages: ['Chat'],
      def: null,
      isActive: false,
      defRoute: null,
      routes: new Array<IRouterNavigationRoute>()
    },
    {
      name: 'Changelog',
      pages: ['Changelog'],
      def: null,
      isActive: false,
      defRoute: null,
      routes: new Array<IRouterNavigationRoute>()
    }
  ];

  // page = Page;

  // Bound to login modal
  loginActive = false;

  // Currently active navigation routes (Populated)
  activeRoutes = new Array<IRouterNavigationRoute>();

  constructor(private elem: Element, private _eva: EventAggregator) {

    this._eva.subscribeOnce('router:navigation:complete', payload => {

      let activePage = this.router.history.location.hash.replace(/#?\/?/g, '');
      console.log(this.router.history.location, activePage);

      for (var nav of this.navList) {

        this.router.navigation.forEach(route => {
          if (nav.name === route.config['navName']) {

            // Set active INav obj based on page URL
            if (route.title.toLowerCase() === activePage)
              nav.isActive = true;

            // Set the default route object
            if (nav.def === route.title) {
              nav.defRoute = route;
            }

            // Add routes to INav template obj
            nav.routes.push(route);
          }
        });

        if (nav.isActive) {
          this.populateRoutes(nav);
        }

      }


    });
  }


  /** Aurelia router configuration */
  configureRouter(config: IRouterConfig, router: Router) {
    config.title = 'Webaeble';
    this.createRoutes(this.navList, config);
    this.router = router;
  }


  /** Activate login drop down on click */
  loginDropDown() {

    this.loginActive = !this.loginActive;
    // this.page.overlay = !this.page.overlay;

  }

  lightsOnOff(ev: MouseEvent) {


    if (ev.button == 0) {

      if (this.lightsOnTimeout) return;
      this.lightsOnTimeout = true;

      let obj = <HTMLElement>ev.target
        , transition = document.createElement('style')
        , timeoutSpeed = 750;

      let transHTML =
        '<style id="Transition">' +
        '* { transition: all .5s !important; }' +
        '</style>';

      $('head')[0].insertAdjacentHTML('afterbegin', transHTML);

      if (obj.classList.contains('light')) {
        localStorage.setItem('lights', 'off');
        obj.classList.remove('light');
        obj.classList.add('dark');
        $('#Theme')[0].setAttribute('href', '../css/themes/dark/theme.css');
        this.lightsTimeout = setTimeout(() => {
          $('head')[0].removeChild($('#Transition')[0]);
          this.lightsOnTimeout = false;
        }, timeoutSpeed);

      }
      else {
        localStorage.setItem('lights', 'on');
        obj.classList.remove('dark');
        obj.classList.add('light');
        $('#Theme')[0].setAttribute('href', '../css/themes/light/theme.css');
        this.lightsTimeout = setTimeout(() => {
          $('head')[0].removeChild($('#Transition')[0]);
          this.lightsOnTimeout = false;
        }, timeoutSpeed);
      }
    }

  }


  /**
   * Map the default navigation routes for the current view
   *
   * @param navList List of navigation objects
   * @param config The Aurelia router configuration variable
   */
  private createRoutes(navList: INav[], config: IRouterConfig) {

    let routes = [];

    for (let nav of navList) {

      // Add default route
      if (nav.def) {
        routes.push({ route: '', redirect: nav.pages[0].toLowerCase() });
      }

      for (let title of nav.pages) {
        routes.push({
          route: title.toLowerCase(),
          moduleId: `./${nav.name.toLowerCase() }/${title}`,
          nav: true,
          title,
          navName: nav.name
        });
      }
    }

    config.map(routes);

  }

  get lights() {
    return localStorage.getItem('lights') == 'on';
  }


  /** DOM Ready (Called by Aurelia) */
  attached() {

    // this.page.rightTray = new PageElement('TrayRight');

    let req = new XMLHttpRequest()
      , lights = localStorage.getItem('lights');

    let light = (lights == 'off') ? 'light' : 'dark';
    req.open('GET', `css/themes/${light}/theme.css`, true);
    req.send();

  }


  login() {
    

    let lock = new Auth0Lock('VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj', 'aedaeum.auth0.com');

    lock.show((err, profile, token) => {
      if (err) {
        console.error(err.message);
        return;
      }

      console.info('User Logged In');
      console.log(profile);
    });

    // let auth = new Auth0({
    //   domain: 'aedaeum.auth0.com',
    //   clientID: 'VOhiMrFfTsx2SSgoGOr25G8qa3J6W0yj',
    //   callbackURL: 'http://localhost:5007/'
    // })

    // auth.login({
    //   connection: 'facebook'
    // }, () => {})
  }



  /**
   * Populates the navigation elements for the respective
   * navigation tabs.
   *
   * @param nav A navigation object
   * @param toggleNav Toggle the isActive property on the INav objects
   */
  populateRoutes(nav: INav, e?: MouseEvent, toggleNav = false) {

    if (typeof e !== 'undefined') {
      if (e.button !== 0) return;
    }

    // Don't populate tabs without default tab
    if (nav.def)
      this.activeRoutes = nav.routes;
    else
      this.activeRoutes = [];


    if (toggleNav) {
      this.navList.forEach(n => {
        n.isActive = n === nav;
      });

      console.log(nav.routes[0].href);
      this.goTo(nav.def ? nav.defRoute.href : nav.routes[0].href);
    }
  }

  // Activate the router manually
  goTo(href: string) {
    location.href = href;
  }


}
