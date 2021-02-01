import { defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouteMap } from "@/composeables/route-map";
import { VuexStore } from "@/vuex/vuex-store";
import icon from '@/components/ui/icon.vue';

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
    const menuElRef = ref<HTMLDivElement|null>(null);
    const opened  = ref(false);
    const store   = useStore<VuexStore>();
    const routeMap = useRouteMap();

    if (!props.contentId) throw Error('Missing content ID');

    const els: ExternalElements = {
      contentToSlide: null,
      header: null
    };

    const floatOnScroll = () => {
      document.body.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop;
        const pos       = menuElRef.value!.style.position
        ;
        if (scrollTop >= els.header!.offsetHeight + 1) {
          if (pos != 'fixed') menuElRef.value!.style.position = 'fixed';
          return;
        }
        if (pos != 'absolute') menuElRef.value!.style.position = 'absolute';
      });
    };

    const createSlideStyle = () => {
      const style = document.createElement('style');
      style.id = 'SlideStyle';
      style.innerHTML =
        `#${props.contentId}.--menu-open { left: ${menuElRef.value!.clientWidth}px; }`
      ;
      document.head.append(style);
    };

    // Setup events and animation style
    onMounted(() => {
      els.contentToSlide = document.getElementById(props.contentId!);
      els.header = document.getElementById(props.headerId!);

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