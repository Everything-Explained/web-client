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
import { defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouteMap } from "@/composeables/route-map";
import { VuexStore } from "@/vuex/vuex-store";
import eeIconVue from '@/components/ui/ee-icon.vue';

interface ExternalElements {
  contentToSlide ?: HTMLElement;
  header         ?: HTMLElement;
  menu           ?: HTMLDivElement;
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

    const els: ExternalElements = { menu: menuElRef.value! };

    function floatOnScroll() {
      document.body.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop;
        const menu      = els.menu!;
        const pos       = menu.style.position
        ;
        if (scrollTop >= els.header!.offsetHeight + 1) {
          if (pos != 'fixed') menu.style.position = 'fixed';
          return;
        }
        if (pos != 'absolute') menu.style.position = 'absolute';
      });
    }

    function createSlideStyle() {
      const style = document.createElement('style');
      style.id = 'SlideStyle';
      style.innerHTML =
        `#${props.contentId}.--menu-open { left: ${menuElRef.value!.clientWidth}px; }`
      ;
      document.head.append(style);
    }

    // Setup events and animation style
    onMounted(() => {
      els.contentToSlide = document.getElementById(props.contentId!)!;
      els.header         = document.getElementById(props.headerId!)!;

      if (menuElRef.value && els.contentToSlide) {
        floatOnScroll();
        createSlideStyle();
      }
    });

    // Toggle menu
    watch(() => store.state.isMenuOpening,
      async (isOpening) => {
        opened.value = isOpening;
        if (isOpening) els.contentToSlide?.classList.add('--menu-open');
        else           els.contentToSlide?.classList.remove('--menu-open');
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