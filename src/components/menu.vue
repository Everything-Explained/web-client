<template>
  <menu ref='menu' class="app-menu" :class="{ '--opened': opened }">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <icon
        class='app-menu__header_exit-icon'
        :type='"cross"'
        @mousedown="closeMenu"
      ></icon>
    </header>
    <ul>
      <li class="app-menu_item" v-for="(route, i) of routes" :key="i" @click="closeMenu">
        <router-link :to="route.path">{{ route.meta.title }}</router-link>
      </li>
    </ul>
  </menu>
</template>



<script lang='ts'>
import { defineComponent, HtmlHTMLAttributes, onMounted, ref, Ref, watch } from "vue";
import { RouteRecordNormalized, useRouter } from "vue-router";
import { useStore } from "vuex";
import { VuexStore } from "../vuex/vuex-store";
import icon from './icon.vue';

type Route = RouteRecordNormalized;
type Routes = Route[];

interface ExternalElements {
  contentToSlide: HTMLElement|null;
  header: HTMLElement|null;
}

export default defineComponent({
  components: {
    icon,
  },
  props: {
    contentId: String,
    headerId: String,
  },
  setup(props) {
    const menuRef = ref<HTMLDivElement|null>(null);
    const opened  = ref(false);
    const store   = useStore<VuexStore>();
    const router  = useRouter();
    const routes  = router.getRoutes();

    if (!props.contentId) throw Error('Missing content ID');

    const isValidRoute  = (route: Route) => route.meta.display == true && !route.aliasOf;
    const orderRouteAsc = (r1: Route, r2: Route) => r1.meta.order - r2.meta.order;
    const normalizedRoutes = (() => {
      return routes
        .filter(isValidRoute)
        .sort(orderRouteAsc)
        .map(route => {
          return {
            path: { name: route.name },
            meta: route.meta,
            name: route.name
          };
        })
    })();
    const els: ExternalElements = {
      contentToSlide: null,
      header: null
    }

    const floatOnScroll = () => {
      document.body.addEventListener('scroll', (e) => {
        const scrollTop = document.body.scrollTop;
        const pos       = menuRef.value!.style.position
        ;
        if (scrollTop >= els.header!.offsetHeight + 1) {
          if (pos != 'fixed') menuRef.value!.style.position = 'fixed';
          return;
        }
        if (pos != 'absolute') menuRef.value!.style.position = 'absolute';
      });
    }
    const createSlideStyle = () => {
      const style = document.createElement('style');
      style.id = 'SlideStyle';
      style.innerHTML =
        `#${props.contentId}.--menu-open { transform: translate(${menuRef.value!.clientWidth}px); }`
      ;
      document.head.append(style);
    }
    onMounted(() => {
      els.contentToSlide = document.getElementById(props.contentId!);
      els.header = document.getElementById(props.headerId!);

      if (menuRef.value && els.contentToSlide) {
        floatOnScroll();
        createSlideStyle();
      }
    });
    // toggle menu
    watch(() => store.state.isMenuOpening,
      async (isOpening) => {
        opened.value = isOpening;
        if (isOpening) els.contentToSlide?.classList.add('--menu-open');
        else           els.contentToSlide?.classList.remove('--menu-open');
      });

    return {
      menu: menuRef,
      opened,
      closeMenu: () => store.commit('close-menu'),
      routes: normalizedRoutes
    };
  }
});

</script>