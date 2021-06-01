import { createRouter,
         createWebHistory,
         NavigationGuardNext,
         RouteLocationNormalized,
         RouteRecordRaw } from 'vue-router';
import { isAuthed }       from '@/globals';
import Home               from '@/views/home.vue';
import i404               from '@/views/errors/i404.vue';
import R3dVideos          from '@/views/red33m/r3d.videos.vue';
import Blog               from '@/views/blog.vue';
import Videos             from '@/views/library/lib.videos.vue';
import Literature         from '@/views/library/lib.literature.vue';
import red33mAuth         from '@/views/accessory/red33m-auth.vue';
import red33mForm         from '@/views/accessory/red33m-form.vue';
import r3d_litVue         from '@/views/red33m/r3d.literature.vue';
import changelogVue       from '@/views/utility/changelog.vue';


const routes: Array<RouteRecordRaw> = [
  { path: '/home', alias: '/',          name: 'home',        component: Home,         },
  { path: '/blog/:page?',               name: 'blog',        component: Blog,         },
  { path: '/support',                   name: 'support',     component: () => import('@/views/support.vue'),   },
  { path: '/red33m/videos',             name: 'r3d-videos',  component: R3dVideos,  beforeEnter: isAuthedGuard },
  { path: '/red33m/literature/:page?',  name: 'r3d-lit',     component: r3d_litVue, beforeEnter: isAuthedGuard },
  { path: '/red33m/auth',               name: 'red33m-auth', component: red33mAuth,   },
  { path: '/red33m/form',               name: 'red33m-form', component: red33mForm,   },
  { path: '/library/videos',            name: 'lib-videos',  component: Videos,       },
  { path: '/library/literature/:page?', name: 'lib-lit',     component: Literature,   },
  { path: '/changelog/:page?',          name: 'changelog',   component: changelogVue, },
  { path: '/:pathMatch(.*)*',           name: '404',         component: i404,       meta: { display: false } }
];

function isAuthedGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!isAuthed()) return next('/red33m/auth');
  next();
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;