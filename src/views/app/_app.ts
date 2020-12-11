import { defineComponent, onMounted, Ref, ref, watch } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { Route } from "../../global-types";
import Menu from '../../components/menu.vue';
import icon from '../../components/icon.vue';

export default defineComponent({
  components: {
    'main-menu': Menu,
    icon,
  },
  data: () => {
    return {
      title: ''
    };
  },
  setup() {
    // const version     = '36';
    // const versionType = 'α';
    const body          = ref<HTMLBodyElement|null>(null);
    const blogScrollPos = ref(0);
    const router        = useRouter();
    const route         = useRoute();

    onMounted(() => {
      body.value = document.getElementsByTagName('body')[0];
    });

    const setScrollTop = (top: number) => {
      // Prevents user from noticing scroll reset.
      // Resets when view is hidden in transition.
      setTimeout(() => body.value!.scrollTop = top, 350);
    };

    const setBlogScrollPos = () => {
      if (route.path.includes('/blog/')) {
        blogScrollPos.value = body.value!.scrollTop;
        setScrollTop(0);
      }
      if (route.path == '/blog') {
        setScrollTop(blogScrollPos.value);
      }
    };

    // onRouteChange
    watch(() => route.path,
      async () => {
        await router.isReady();
        if (route.path.includes('/blog')) {
          setBlogScrollPos(); return;
        }
        setScrollTop(0);
      }
    );
  },
});
