import { RouterConfiguration, Router } from 'aurelia-router';
import { inject, computedFrom } from 'aurelia-framework';
import { Session } from '../../shared/models/session';

@inject(Session)
export class Home {

  public router: Router;

  constructor(public session: Session) {}

  configureRouter(config: RouterConfiguration, router: Router) {

    let relLoc = 'components/home/pages';

    let routes = [
      {route: '', redirect: 'welcome'},
      {route: 'welcome', name: 'welcome', moduleId: `${relLoc}/welcome`, nav: true},
      {route: 'rules', name: 'rules', moduleId: `${relLoc}/rules`, nav: true},
      {route: ['faq', 'faq/:page'], name: 'faq', moduleId: `${relLoc}/faq/faq`, nav: true }
    ];

    if (this.session.authed) {
      routes.push({route: 'blog', name: 'blog', moduleId: `${relLoc}/blog`, nav: true});
    }

    config.map(routes);
    this.router = router;
  }

  @computedFrom('router.currentInstruction.config.name')
  get activeRoute() {
    return this.router.currentInstruction.config.name;
  }

}