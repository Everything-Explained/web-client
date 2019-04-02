import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/Home.vue';
import Resp404 from './views/Resp404.vue';
import FAQ from './views/faq/Faq.vue';
import Blog from './views/blog/Blog.vue';
import Invite from './views/invite/Invite.vue';
import Changelog from './views/changelog/Changelog.vue';
import Signin from './views/signin/Signin.vue';
import { RouteConfig } from 'vue-router';
import { SessionData } from './api/server';

export default function initRoutes(session: SessionData) {
  Vue.use(Router);

  const routes = [
    {
      path: '/',
      redirect: 'home',
      meta: { display: false }
    },
    {
      path: '/home/:page?',
      name: 'home',
      component: Home,
      props: true,
      meta: { display: true }
    },
    {
      path: '/changelog/:page?',
      name: 'changelog',
      component: Changelog,
      props: true,
      meta: { display: true }
    },
    {
      path: '/faq/:page?',
      name: 'faq',
      component: FAQ,
      props: true,
      meta: { display: true }
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite,
      meta: { display: false }
    },
    {
      path: '*',
      name: '404',
      component: Resp404,
      meta: { display: false }
    }
  ] as RouteConfig[]
  ;

  const signinRedirect = session.authed ? '' : 'signin';

  routes.push(...[
    {
      path: '/signin/:callback?/:type?',
      name: 'signin',
      component: Signin,
      redirect: session.authed ? 'settings' : '',
      meta: { display: !session.authed }
    },
    {
      path: '/blog/:page?',
      name: 'blog',
      component: Blog,
      props: true,
      redirect: signinRedirect,
      meta: { display: session.authed }
    },
    {
      path: '/chat',
      name: 'chat',
      redirect: signinRedirect,
      meta: { display: session.authed }
    },
    {
      path: '/settings',
      name: 'settings',
      redirect: signinRedirect,
      meta: { display: session.authed }
    }
  ]);
u
  return new Router({ routes });
}


