
import {Router, NavModel, RouterConfiguration } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Page, PageElement} from './helpers/page';
import {$} from './helpers/domop';
import * as encrypt from './helpers/cheap-encrypt';
import {Login} from './app-login';
import {ModernModal} from './helpers/modern-modal';
import {Logger} from './helpers/logger';
import {ErrorHandler} from './helpers/errorHandler';
import {Session} from './app-session';



interface PageConfiguration {
  route: NavModel;
}

export interface MenuItem {
  name: string;
  pages: TabPage[];
  def: string;
  defRoute?: NavModel;
  isActive: boolean;
  routes?: NavModel[];
}

// TODO - Potential for recursive functionality
export interface TabPage {
  name: string;
  hidden?: boolean;
  classes?: string;
  subPages?: TabPage[];
}


@inject(Element, EventAggregator, ModernModal, Logger, ErrorHandler, Login, Session)
export class App {

  version = '0.4.0';

  router: Router;

  page = Page;

  lightsTimeout = 0;
  lightsOnTimeout = false;

  // TODO - Routes are dirty
  public mainMenu = [
    {
      name:     'home',
      pages: [
        {name: 'about'},
        {name: 'rules'},
        {name: 'faq'},
        {
          name: 'signin',
          subPages: [
            {name: 'invite'},
            {name: 'signup'}
          ],
          classes: 'login icon-enter'
        },
        {
          name: 'settings',
          hidden: true,
          classes: 'settings icon-cog2'
        }
      ],
      def:      'about',
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'chat',
      pages:    [{name: 'chat'}],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    },
    {
      name:     'changelog',
      pages:    [{name: 'changelog'}],
      def:      null,
      isActive: false,
      defRoute: null,
      routes:   new Array<NavModel>()
    }
  ] as MenuItem[];

  // page = Page;

  // Currently active navigation routes (Populated)
  activeRoutes = new Array<NavModel>();

  private _scrollbars:   IOptiscrollInstance;
  private _modalOverlay: HTMLElement;

  constructor(private elem:          Element,
              private _eva:          EventAggregator,
              private _modal:        ModernModal,
              private _log:          Logger,
              private _errorHandler: ErrorHandler,
              private _login: Login,
              private _session: Session)
  {

    if (this._session.authed) {
      for (let p of this.mainMenu[0].pages) {
        if (p.name.toLowerCase() == 'signin') {
          p.hidden = true;
        }
        if (p.name.toLowerCase() == 'settings') {
          p.hidden = false;
        }
      }
    }

    this._initFirstMenuItem();

    this._setupNavigationCallbackHandler();

    window.onresize = (ev: UIEvent) => {
      if (this._scrollbars)
        this._scrollbars.update();
    };


  }


  /**
   * Makes sure that the proper menu/page elements are higlighted
   * when the site is loaded for the first time.
   */
  private _initFirstMenuItem() {

    this._eva.subscribeOnce('router:navigation:complete', payload => {

      let activePage = payload.instruction.fragment.substr(1).toLowerCase()
        , foundActiveItem = false;

      for (let item of this.mainMenu) {
        this.router.navigation.forEach(route => {

          if (item.name === route.config['menuName']) {

            // Set active MenuItem obj based on page URL
            if (route.config.name === activePage)
              item.isActive = true;

            // Set the default route object
            if (item.def === route.name) {
              item.defRoute = route;
            }

            // Add routes to INav template obj
            item.routes.push(route);
          }
        });

        if (item.isActive) {
          this.populateRoutes(item);
          foundActiveItem = true;
        }

      }
      if (!foundActiveItem) {
        this.populateRoutes(this.mainMenu[0]);
      }

    });
  }


  /**
   * Sets up an event that fires on every successful page
   * navigation.
   */
  private _setupNavigationCallbackHandler() {

    this._eva.subscribe('router:navigation:complete', payload => {

      // ############   HANDLE PAGE SCROLLBARS   ############ //
      // Make sure there are no active scrollbars
      if (this._scrollbars) this._scrollbars.destroy();

      let content = document.getElementById('PageContent');

      // Only activate scrollbar if the page contains the optiscroll class
      if (content.querySelector('section.optiscroll-content')) {
        this._scrollbars = new Optiscroll(content, {
          autoUpdate: false
        });
      }

      if (this._session.isFirstSignin) {
        for (let r of this.mainMenu[0].routes) {
          if (r.config.route == 'signin') {
            r.config['hidden'] = true;
          }

          if (r.config.route == 'settings') {
            r.config['hidden'] = false;
          }
        }
        this._session.isFirstSignin = false;
      }

      // ############   HANDLE TAB POPULATION   ############ //
      // Execute only if routes have been populated
      // Toggles the tabs on back/forward
      if (this.mainMenu[0].routes.length) {
        this.mainMenu.forEach(n => {
          n.isActive = n.name == payload.instruction.config.menuName;
          if (n.isActive) {
            if (window.loggedin) {
              this.populateRoutes(n);
            } else {
              this.populateRoutes(n, null, false);
            }
          }
        });
      }

    });

  }


  /** Aurelia router configuration */
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Noumenae';
    this.createRoutes(this.mainMenu, config);
    this.router = router;
    this.router.handleUnknownRoutes({
      route: '',
      moduleId: './views/error/F404'
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


  /**
   * Map the default navigation routes for the current view
   *
   * @param navList List of navigation objects
   * @param config The Aurelia router configuration variable
   */
  private createRoutes(menuItems: MenuItem[], config: RouterConfiguration) {

    let routes = [];

    for (let item of menuItems) {

      // Add default route
      if (item.def) {
        routes.push({ route: '', redirect: item.pages[0].name.toLowerCase() });
      }

      // TODO - Don't hardcode route params (FAQ/:query)
      // TODO - Won't highlight proper tab or child tabs on first load (FAQ/:query)
      for (let page of item.pages) {
        if (page.name == 'faq') {
          routes.push({
            route: [`${page.name}`, `${page.name}/:query`],
            moduleId: `views/${item.name}/${page.name}`,
            nav: true,
            name: page.name,
            menuName: item.name,
            subItem: false,
            classes: page.classes || '',
            hidden: page.hidden || false
          });

        }
        else {

          let route = {
            route: page.name,
            moduleId: `views/${item.name}/${page.name}`,
            nav: true,
            name: page.name,
            menuName: item.name,
            subItem: false,
            classes: page.classes || '',
            hidden: page.hidden || false
          };

          if (page.name.toLowerCase() == 'settings') {
            if (!window.session.authed) {
              route['redirect'] = 'signin';
            }
          }

          if (page.name.toLowerCase() == 'signin') {
            if (window.session.authed) {
              route['redirect'] = 'settings';
            }
          }

          routes.push(route);

          // if (page.subPages) {
          //   for (let subpage of page.subPages) {
          //     routes.push({
          //       route: subpage.name.toLowerCase(),
          //       moduleId: `./${item.name.toLowerCase()}/${subpage.name}`,
          //       nav: true,
          //       title: subpage.name,
          //       menuName: item.name,
          //       subItem: true
          //     });
          //   }
          // }
        }
      }

    }

    config.map(routes);


  }



  get lights() {
    return localStorage.getItem('lights') == 'on';
  }


  /** DOM Ready (Called by Aurelia) */
  attached() {

    this._errorHandler.init();
    this._log.init();

    let req = new XMLHttpRequest()
      , lights = localStorage.getItem('lights');

    this._modal.init('overlay');



    // this._login.initAuthLibs();

    // let light = (lights == 'off') ? 'light' : 'dark';
    // req.open('GET', `css/themes/${light}/theme.css`, true);
    // req.send();

  }

  getViewStrategy() {
    return 'app.html';
  }



  /**
   * Populates the navigation elements for the respective
   * navigation tabs.
   *
   * @param nav A navigation object
   * @param toggleNav Toggle the isActive property on the INav objects
   */
  populateRoutes(item: MenuItem, e?: MouseEvent, toggleNav = false) {

    // Only activate on left-click
    if (e && typeof e != 'undefined') {
      if (e.button != 0) return;
    }

    // TODO - This is a hack and should exist in the router configuration
    if (!item.routes.length) {
      let href = location.href.split('https://')[1].split('/')[0];
      this.goTo('https://' + href);
    }

    // Don't populate tabs without default tab
    if (item.def) {
      let routes = item.routes.filter((v) => {
        return !v.config['subItem'] && !v.config['hidden'];
      });
      this.activeRoutes = routes;
    }
    else
      this.activeRoutes = [];


    if (toggleNav) {
      this.mainMenu.forEach(i => {
        i.isActive = i === item;
      });

      let def = item.def || item.routes[0].href;
      this.router.navigate(def);
    }
  }



  // Activate the router manually
  // TODO - use route.navigate
  goTo(href: string) {
    location.href = href;

  }


}
