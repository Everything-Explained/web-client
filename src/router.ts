import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/Home.vue';
import Resp404 from './views/Resp404.vue';
import FAQ from './views/faq/Faq.vue';
import Blog from './views/blog/Blog.vue';
import Invite from './views/invite/Invite.vue';
import Changelog from './views/changelog/Changelog.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home/:page?',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/changelog/:page?',
      name: 'changelog',
      component: Changelog,
      props: true
    },
    {
      path: '/faq/:page?',
      name: 'faq',
      component: FAQ,
      props: true
    },
    {
      path: '/blog/:page?',
      name: 'blog',
      component: Blog,
      props: true
    },
    {
      path: '/invite',
      name: 'invite',
      component: Invite,
      props: true
    },
    {
      path: '*',
      name: '404',
      component: Resp404
    }
  ]
})
