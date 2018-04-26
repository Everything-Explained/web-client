import { RouterConfiguration, Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { Session } from '../../shared/models/session';

@inject(Session)
export class Home {

  public router: Router;

  constructor(public session: Session) {}

  configureRouter(config: RouterConfiguration, router: Router) {

    let routes = [
      {route: '', redirect: 'welcome'},
      {route: 'welcome', name: 'welcome', moduleId: 'components/home/pages/welcome', nav: true},
      {route: 'rules', name: 'rules', moduleId: 'components/home/pages/rules', nav: true},
      {route: ['faq', 'faq/:page'], name: 'faq', moduleId: 'components/home/pages/faq', nav: true }
    ];

    if (this.session.authed) {
      routes.push({route: 'blog', name: 'blog', moduleId: 'components/home/pages/blog', nav: true});
    }

    config.map(routes);
    this.router = router;
  }

}