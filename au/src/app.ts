
import {Router, NavModel, RouterConfiguration, RouteConfig } from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Login} from './app-login';
import {Session} from './app-session';
import {MiniModal} from './helpers/minimodal';


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

  version = '24';

  router: Router;

  private _miniModal: MiniModal;

  lightsTimeout = 0;
  lightsOnTimeout = false;

  // page = Page;

  // Currently active navigation routes (Populated)
  activeRoutes = new Array<NavModel>();

  private _modalOverlay: HTMLElement;
  private _isFirstNavigation = true;

  public mainRouteTree = [];
  public tabRouteTree = [];

  public routes = [
    {
      name: 'home',
      routes: ['', 'home'],
      redirect: 'home/welcome',
      hasChildren: true,
      tabs: [
        {
          name: 'welcome',
          page: 'home/welcome'
        },
        {
          name: 'rules',
          page: 'home/rules'
        },
        {
          name: 'faq',
          routes: ['home/faq', 'home/faq/:page'],
          page: 'home/faq'
        },
        {
          name: 'blog',
          page: 'home/blog',
          hidden: true
        },
        {
          name: 'signin',
          page: 'home/signin',
          classes: 'login icon-enter'
        },
        {
          name: 'settings',
          page: 'home/settings',
          hidden: true,
          classes: 'settings icon-cog2'
        }
      ]
    },
    {
      name: 'changelog',
      routes: ['changelog'],
      page: 'changelog/changelog'
    },
    {
      name: 'chat',
      routes: ['chat'],
      page: 'chat/chat'
    }
  ] as IRoute[];

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

    this._initFirstMenuItem();

    this._setupNavigationCallbackHandler();


  }



  /**
   * Makes sure that the proper menu/page elements are higlighted
   * when the site is loaded for the first time.
   */
  private _initFirstMenuItem() {

    this._eva.subscribeOnce('router:navigation:complete', payload => {

      console.log(this.router.navigation);

    //   let activePage = payload.instruction.fragment.substr(1).toLowerCase()
    //     , foundActiveItem = false;

    //   for (let item of this.mainMenu) {
    //     this.router.navigation.forEach(route => {

    //       if (item.name === route.config['menuName']) {

    //         // Set active MenuItem obj based on page URL
    //         if (route.config.name === activePage)
    //           item.isActive = true;

    //         // Set the default route object
    //         if (item.def === route['name']) {
    //           item.defRoute = route;
    //         }

    //         // Add routes to INav template obj
    //         item.routes.push(route);
    //       }
    //     });

    //     if (item.isActive) {
    //       this.populateRoutes(item);
    //       foundActiveItem = true;
    //     }

    //   }
    //   if (!foundActiveItem) {
    //     this.populateRoutes(this.mainMenu[0]);
    //     this.mainMenu[0].isActive = true;
    //   }

    });
  }


  /**
   * Sets up an event that fires on every successful page
   * navigation.
   */
  private _setupNavigationCallbackHandler() {

    // this._eva.subscribe('router:navigation:complete', payload => {

    //   if (this._session.isFirstSignin) {
    //     for (let r of this.mainMenu[0].routes) {
    //       if (r.config.route == 'signin') {
    //         r.config['hidden'] = true;
    //       }

    //       if (r.config.route == 'settings') {
    //         r.config['hidden'] = false;
    //       }
    //     }
    //     this._session.isFirstSignin = false;
    //   }

    //   // ############   HANDLE TAB POPULATION   ############ //
    //   // Execute only if routes have been populated
    //   // Toggles the tabs on back/forward
    //   if (this.mainMenu[0].routes.length) {
    //     this.mainMenu.forEach(n => {
    //       n.isActive = n.name == payload.instruction.config.menuName;
    //       if (n.isActive) {
    //         if (window.loggedin) {
    //           this.populateRoutes(n);
    //         } else {
    //           this.populateRoutes(n, null, false);
    //         }
    //       }
    //     });
    //   }


    // });

  }


  /** Aurelia router configuration */
  configureRouter(config: RouterConfiguration, router: Router) {
    // this.createRoutes(this.mainMenu, config);
    this.router = router;
    config.title = 'Noumenae';
    let routes = this.createRoutes(this.routes, config);
    config.map(routes);
    this.router.handleUnknownRoutes({
      route: '',
      moduleId: './views/error/F404'
    });
  }

  bind() {
    let routeChildren = this.router.routes.filter(r => {
      return (   r.navModel.config['isChild']
              && !~r.route.indexOf(':')); // Exclude special routes
    });
    let routesMain = this.router.routes.filter(r => {
      return (   !r.navModel.config['isChild']
              && !~r.route.indexOf(':') // Exclude special routes
              && !!r.route); // Exclude blank routes
    });

    this.mainRouteTree = routesMain;
    this.tabRouteTree = routeChildren;

    console.log(this.router);
  }

    /**
   * Map the default navigation routes for the current view
   *
   * @param navList List of navigation objects
   * @param config The Aurelia router configuration variable
   */
  private createRoutes(routes: IRoute[], config: RouterConfiguration, isChild = false) {

    let routeMap = [];

    for (let route of routes) {
      if (route.redirect) {
        routeMap.push({
          route: route.routes,
          name: route.name,
          redirect: route.redirect,
          hasChildren: route.hasChildren || false,
          isChild
        });
      } else {
        routeMap.push({
          route: (route.routes) ? route.routes : [route.page],
          name: route.name,
          moduleId: `components/${route.page}`,
          classes: route.classes || '',
          hidden: route.hidden || false,
          hasChildren: route.hasChildren || false,
          isChild
        });
      }

      if (route.tabs) {
        routeMap = routeMap.concat(this.createRoutes(route.tabs, config, true));
      }

    }

    return routeMap;

    // for (let item of menuItems) {

    //   // Add default route
    //   if (item.def) {
    //     routes.push({ route: '', redirect: item.pages[0].name.toLowerCase() });
    //   }

    //   for (let page of item.pages) {
    //     if (page.name == 'faq') {
    //       routes.push({
    //         route: [`${page.name}`, `${page.name}/:query`],
    //         moduleId: `views/${item.name}/${page.name}`,
    //         nav: true,
    //         name: page.name,
    //         menuName: item.name,
    //         subItem: false,
    //         classes: page.classes || '',
    //         hidden: page.hidden || false
    //       });

    //     }
    //     else {

    //       let route = {
    //         route: page.name,
    //         moduleId: `views/${item.name}/${page.name}`,
    //         nav: true,
    //         name: page.name,
    //         menuName: item.name,
    //         subItem: false,
    //         classes: page.classes || '',
    //         hidden: page.hidden || false
    //       };

    //       if (page.name.toLowerCase() == 'settings') {
    //         if (!window.session.authed) {
    //           route['redirect'] = 'signin';
    //         }
    //       }

    //       if (page.name.toLowerCase() == 'signin') {
    //         if (window.session.authed) {
    //           route['redirect'] = 'settings';
    //         }
    //       }

    //       if (page.name.toLowerCase() == 'blog') {
    //         if (!window.session.authed) {
    //           route['redirect'] = 'welcome';
    //         }
    //       }

    //       routes.push(route);

    //       // if (page.subPages) {
    //       //   for (let subpage of page.subPages) {
    //       //     routes.push({
    //       //       route: subpage.name.toLowerCase(),
    //       //       moduleId: `./${item.name.toLowerCase()}/${subpage.name}`,
    //       //       nav: true,
    //       //       title: subpage.name,
    //       //       menuName: item.name,
    //       //       subItem: true
    //       //     });
    //       //   }
    //       // }
    //     }
    //   }

    // }

    // config.map(routes);


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

    let req = new XMLHttpRequest()
      , lights = localStorage.getItem('lights');
    this._isFirstNavigation = false;


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



  /**
   * Populates the navigation elements for the respective
   * navigation tabs.
   *
   * @param nav A navigation object
   * @param toggleNav Toggle the isActive property on the INav objects
   */
  populateRoutes(item: IRoute, e?: MouseEvent, toggleNav = false) {

    // // Only activate on left-click
    // if (e && typeof e != 'undefined') {
    //   if (e.button != 0) return;
    // }

    // // TODO - This is a hack and should exist in the router configuration
    // if (!item.routes.length) {
    //   let href = location.href.split('https://')[1].split('/')[0];
    //   this.goTo('https://' + href);
    // }

    // // Don't populate tabs without default tab
    // if (item.def) {
    //   let routes = item.routes.filter((v) => {
    //     return !v.config['subItem'] && !v.config['hidden'];
    //   });
    //   this.activeRoutes = routes;
    // }
    // else
    //   this.activeRoutes = [];


    // if (toggleNav) {
    //   this.mainMenu.forEach(i => {
    //     i.isActive = i === item;
    //   });

    //   let def = item.def || item.routes[0].href;
    //   this.router.navigate(def);
    // }
  }



  // Activate the router manually
  // TODO - use route.navigate
  goTo(href: string) {
    console.log('routing');
    this.router.navigate(href);
  }


}
