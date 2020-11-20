import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home       from '../views/home/home.vue';
import Blog       from '../views/blog/blog.vue';
import FAQ        from '../views/faq/faq.vue';
import Literature from '../views/literature/literature.vue';
import Changelog  from '../views/changelog/changelog.vue';
import i404       from '../views/errors/i404.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: Home,
    meta: { display: true, order: 1, title: 'About Us' }
  },
  {
    path: '/blog/:page?',
    name: 'blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/blog/blog.vue'),
    meta: { display: true, order: 2, title: 'Blog' }
  },
  {
    path: '/faq/:page?',
    name: 'faq',
    component: FAQ,
    meta: { display: true, order: 3, title: 'Frequently Asked Questions' }
  },
  {
    path: '/literature/:category?/:page?',
    name: 'lit',
    component: Literature,
    meta: { display: true, order: 4, title: 'Literature' }
  },
  {
    path: '/changelog/:page?',
    name: 'chg.log',
    component: Changelog,
    meta: { display: false, order: 5, title: 'Changelog' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: i404,
    meta: { display: false }
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;