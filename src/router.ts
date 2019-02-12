import Vue from 'vue';
import Router from 'vue-router';
import Welcome from './views/Welcome.vue';
import About from './views/About.vue';
import Resp404 from './views/Resp404.vue';
import FAQ from './views/faq/Faq.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: Welcome
    },
    {
      path: '/about',
      name: 'about',
      component: About
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/changelog/:page?',
      name: 'changelog',
      component: () => import('./views/changelog/Changelog.vue'),
      props: true
    },
    {
      path: '/faq/:page?',
      name: 'faq',
      component: FAQ,
      props: true
    },
    {
      path: '*',
      name: '404',
      component: Resp404
    }
  ]
})
