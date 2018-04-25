import { RouterConfiguration, Router } from 'aurelia-router';


export class Home {

  public router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {route: '', redirect: 'welcome'},
      {route: 'welcome', name: 'welcome', moduleId: 'components/home/pages/welcome', nav: true},
      {route: 'rules', name: 'rules', moduleId: 'components/home/pages/rules', nav: true},
      {route: ['faq', 'faq/:page'], name: 'faq', moduleId: 'components/home/pages/faq', nav: true }
    ]);
    this.router = router;
  }

}