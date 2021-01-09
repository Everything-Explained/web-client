import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home       from '../views/home/home.vue';
import i404       from '../views/errors/i404.vue';
import Red33m from '../views/red33m/red33m.vue';
import Test from '../views/test/test.vue';
import Blog from '../views/blog/blog.vue';
import Videos from '../views/library/videos.vue';
import Literature from '../views/library/literature.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/blog/:post?',
    name: 'blog',
    component: Blog,
  },
  {
    path: '/red33m',
    name: 'red33m',
    component: Red33m,
  },
  {
    path: '/videos',
    name: 'videos',
    component: Videos,
  },
  {
    path: '/literature',
    name: 'literature',
    component: Literature,
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