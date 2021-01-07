import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home       from '../views/home/home.vue';
import i404       from '../views/errors/i404.vue';
import Red33m from '../views/red33m/red33m.vue';
import Test from '../views/test/test.vue';
import Blog from '../views/blog/blog.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: Home,
    meta: { display: true, order: 1, title: 'About Us' }
  },
  {
    path: '/blog/:post?',
    name: 'blog',
    component: Blog,
    meta: { display: true, order: 2, title: 'Blog' }
  },
  {
    path: '/red33m',
    name: 'red33m',
    component: Red33m,
    meta: { display: false, order: 3, title: 'RED33M' }
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: Test,
  //   meta: { display: true, order: 4, title: 'Test' }
  // },

  // {
  //   path: '/faq/:page?',
  //   name: 'FAQ',
  //   component: FAQ,
  //   meta: { display: true, order: 3, title: 'Frequently Asked Questions' }
  // },
  // {
  //   path: '/literature/:category?/:page?',
  //   name: 'Literature',
  //   component: Literature,
  //   meta: { display: true, order: 4, title: 'Literature' }
  // },
  // {
  //   path: '/changelog/:page?',
  //   name: 'chg.log',
  //   component: Changelog,
  //   meta: { display: false, order: 5, title: 'Changelog' }
  // },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: i404,
    meta: { display: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;