import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home       from '@/views/root/home.vue';
import i404       from '@/views/errors/i404.vue';
import R3dVideos     from '@/views/red33m/r3d_videos.vue';
import Blog       from '@/views/root/blog.vue';
import Videos     from '@/views/library/lib_videos.vue';
import Literature from '@/views/library/lib_lit.vue';
import red33mAuth from '@/views/accessory/red33m-auth.vue';
import red33mForm from '@/views/accessory/red33m-form.vue';
import { isAuthed } from '@/globals';
import r3d_litVue from '@/views/red33m/r3d_lit.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/blog/:page?',
    name: 'blog',
    component: Blog,
  },
  {
    path: '/red33m/videos',
    name: 'r3d-videos',
    component: R3dVideos,
    beforeEnter: (to, from, next) => {
      if (!isAuthed()) {
        return next({ name: 'red33m-auth'});
      }
      next();
    }
  },
  {
    path: '/red33m/literature/:page?',
    name: 'r3d-lit',
    component: r3d_litVue,
    beforeEnter: (to, from, next) => {
      if (!isAuthed()) {
        return next({ name: 'red33m-auth'});
      }
      next();
    }
  },
  {
    path: '/library/videos',
    name: 'lib-videos',
    component: Videos,
  },
  {
    path: '/library/literature/:page?',
    name: 'lib-lit',
    component: Literature,
  },
  {
    path: '/red33m-auth',
    name: 'red33m-auth',
    component: red33mAuth,
  },
  {
    path: '/red33m-form',
    name: 'red33m-form',
    component: red33mForm,
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