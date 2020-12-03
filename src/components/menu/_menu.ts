import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { VuexStore } from "../../vuex/vuex-store";
import icon from '../icon/icon.vue';

let isStyleCreated = false;

export default defineComponent({
  components: {
    icon,
  },
  setup() {
    const menuRef = ref<HTMLDivElement|null>(null);
    const opened = ref(false);
    const store = useStore<VuexStore>();
    const router = useRouter();

    const routes     = router.getRoutes();
    const realRoutes = routes.filter(
      route => route.meta.display == true && !route.aliasOf
    );
    const orderedRoutes = realRoutes.sort((r1, r2) => {
      return r1.meta.order - r2.meta.order;
    });
    const routeList = orderedRoutes.map(route => {
      return {
        path: route.path.includes('/:') ? route.path.split('/:')[0] : route.path,
        meta: route.meta,
        name: route.name
      };
    });

    let contentToSlide: HTMLElement|null = null;
    onMounted(() => {
      contentToSlide = document.getElementById('MainContainer');
      if (menuRef.value && contentToSlide) {
        createContainerStyle(menuRef.value);
      }
    });

    watch(
      () => store.state.isMenuOpen,
      async (isOpen) => {
        opened.value = isOpen;
        if (isOpen) return contentToSlide?.classList.add('--menu-open');
        contentToSlide?.classList.remove('--menu-open');
    });

    const closeMenu = () => store.commit('closeMenu');
    return {
      menu: menuRef,
      opened,
      closeMenu,
      routes: routeList
    };
  }
});

function createContainerStyle(menu: HTMLElement) {
  if (isStyleCreated) { console.log('return'); return; }
  console.log('not returning');
  const style = document.createElement('style');
  style.innerHTML =
    `.main__container.--menu-open { transform: translate(${menu.clientWidth}px); }`
  ;
  document.head.append(style);
  isStyleCreated = true;
}