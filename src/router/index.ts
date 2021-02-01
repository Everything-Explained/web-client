import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home       from '../views/root/home.vue';
import i404       from '../views/errors/i404.vue';
import Red33m     from '../views/root/red33m.vue';
import Blog       from '../views/root/blog.vue';
import Videos     from '../views/library/videos.vue';
import Literature from '../views/library/literature.vue';
import red33mAuth from '@/views/accessory/red33m-auth.vue';

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
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('passcode')) {
        return next({ name: 'red33m-auth'});
      }
      next();
    }
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
  {
    path: '/red33m-auth',
    name: 'red33m-auth',
    component: red33mAuth,
  },


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