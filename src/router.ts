import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/Home.vue';
import Blog from './views/blog/Blog.vue';
import Invite from './views/invite/Invite.vue';
// import Changelog from './views/changelog/Changelog.vue';
// import Signin from './views/signin/Signin.vue';
import Settings from './views/settings/Settings.vue';
import { RouteConfig } from 'vue-router';
import { SessionData } from './api/server';
import ClientAPI from './api/mock';
import Chat from './views/chat/Chat.vue';
import F404 from './views/Resp404.vue';

export default function initRoutes(session: SessionData, api: ClientAPI) {
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
      component: () => import(/* webpackChunkName: "changelog" */ './views/changelog/Changelog.vue'),
      props: true,
      meta: { display: true }
    },
    {
      path: '/faq/:page?',
      name: 'faq',
      component: () => import(/* webpackChunkName: "faq" */ './views/faq/Faq.vue'),
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
      component: F404,
      meta: { display: false }
    }
  ] as RouteConfig[]
  ;

  const signinRedirect = session.authed ? '' : 'signin';


  routes.push(...[
    {
      path: '/signin/:callback?/:type?',
      name: 'signin',
      component: () => import(/* webpackChunkName: "signin" */ './views/signin/Signin.vue'),
      meta: { display: !session.authed }
    },
    {
      path: '/blog/:page?',
      name: 'blog',
      component: Blog,
      props: true,
      // redirect: signinRedirect,
      meta: { display: !session.authed }
    },
    {
      path: '/chat',
      name: 'chat',
      // redirect: signinRedirect,
      component: Chat, // () => import(/* webpackChunkName: "chat" */ './views/chat/Chat.vue'),
      meta: { display: !session.authed }
    },
    {
      path: '/settings',
      name: 'settings',
      redirect: signinRedirect,
      component: Settings,
      beforeEnter: async (to, from, next) => {
        const settingResp = await api.getSettings();
        if (settingResp.status == 200) {
          to.meta.data = settingResp.data;
          return next();
        }
        next(new Error(`Could not retrieve settings : ${settingResp.status}`))
      },
      meta: { display: session.authed },
    }
  ] as RouteConfig[]);

  return new Router({ routes });
}


