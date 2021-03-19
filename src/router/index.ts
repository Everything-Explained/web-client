import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { isAuthed } from '@/globals';
import Home       from '@/views/root/home.vue';
import i404       from '@/views/errors/i404.vue';
import R3dVideos  from '@/views/red33m/r3d.videos.vue';
import Blog       from '@/views/root/blog.vue';
import Videos     from '@/views/library/lib.videos.vue';
import Literature from '@/views/library/lib.literature.vue';
import red33mAuth from '@/views/accessory/red33m-auth.vue';
import red33mForm from '@/views/accessory/red33m-form.vue';
import r3d_litVue from '@/views/red33m/r3d.literature.vue';

const Changelog = () => import('@/views/utility/changelog.vue');

function isAuthedGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!isAuthed()) return next('/red33m/auth');
  next();
}

const routes: Array<RouteRecordRaw> = [
  { path: '/home', alias: '/',          name: 'home',        component: Home,       },
  { path: '/blog/:page?',               name: 'blog',        component: Blog,       },
  { path: '/red33m/videos',             name: 'r3d-videos',  component: R3dVideos,  beforeEnter: isAuthedGuard },
  { path: '/red33m/literature/:page?',  name: 'r3d-lit',     component: r3d_litVue, beforeEnter: isAuthedGuard },
  { path: '/red33m/auth',               name: 'red33m-auth', component: red33mAuth, },
  { path: '/red33m/form',               name: 'red33m-form', component: red33mForm, },
  { path: '/library/videos',            name: 'lib-videos',  component: Videos,     },
  { path: '/library/literature/:page?', name: 'lib-lit',     component: Literature, },
  { path: '/changelog/:page?',          name: 'changelog',   component: Changelog,  },
  { path: '/:pathMatch(.*)*',           name: '404',         component: i404,       meta: { display: false } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;