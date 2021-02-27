<template>
  <menu ref="menu" :class="['app-menu', { '--opened': opened }]">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <ee-icon class="app-menu__header_exit-icon"
               :type="'cross'"
               @mousedown="closeMenu"
      />
    </header>
    <ul>
      <template v-for="(map, i) of routeMap" :key="i">
        <li v-if="map.name != 'root' && !map.hidden"
            class="app-menu_category"
        >
          {{ map.name }}
        </li>
        <li v-for="(route, j) of map.routes"
            :key="j"
            class="app-menu_item"
            @click="closeMenu"
        >
          <router-link :to="route.path">
            {{ route.title }}
          </router-link>
        </li>
      </template>
    </ul>
  </menu>
</template>



<script lang='ts'>
import { computed, defineComponent, onMounted, ref, watch, Ref } from "vue";
import { useStore } from "vuex";
import { useRouteMap } from "@/router/map";
import { VuexStore } from "@/vuex/vuex-store";
import eeIconVue from '@/components/ui/ee-icon.vue';

interface ExternalElements {
  body   ?: HTMLElement;
  header ?: HTMLElement;
  menu   ?: Ref<HTMLDivElement>;
}

export default defineComponent({
  components: {
    'ee-icon': eeIconVue,
  },
  props: {
    contentId : { type: String, default: '' },
    headerId  : { type: String, default: '' },
  },
  setup(props) {
    const menuElRef = ref<HTMLDivElement|null>(null);
    const opened  = ref(false);
    const store   = useStore<VuexStore>();
    const routeMap = useRouteMap();

    if (!props.contentId) throw Error('Missing content ID');

    const els: ExternalElements = { menu: computed(() => menuElRef.value!) };

    function floatOnScroll() {
      document.body.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop;
        const menu      = els.menu!;
        const pos       = menu.value.style.position
        ;
        if (scrollTop >= els.header!.offsetHeight + 1) {
               if (pos != 'fixed')    menu.value.style.position = 'fixed';
        } else if (pos != 'absolute') menu.value.style.position = 'absolute';
      });
    }

    // Setup events and animation style
    onMounted(() => {
      els.body    = document.getElementById(props.contentId!)!;
      els.header  = document.getElementById(props.headerId!)!;

      if (menuElRef.value && els.body) { floatOnScroll(); }
    });

    // Toggle menu
    watch(() => store.state.isMenuOpening,
      async (isOpening) => {
        opened.value = isOpening;
        els.body?.classList[isOpening ? 'add' : 'remove']('--menu-open');
    });

    return {
      menu: menuElRef,
      opened,
      closeMenu: () => store.commit('close-menu'),
      routeMap,
    };
  }
});
</script>