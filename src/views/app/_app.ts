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
    const body = ref<HTMLBodyElement|null>(null);
    const blogScrollPos = ref(0);
    // const verDesc = `
    //   We shall carry on by 12's until we reach β;
    //   a shift from the arbitrary past into the ever
    //   present - a gift to Me, Myself, and I.
    // `.trim();

    const router = useRouter();
    const route = useRoute();

    onMounted(() => {
      body.value = document.getElementsByTagName('body')[0];
    });

    // Prevents needing scroll position reset in every view.
    onRouteChange(route, router, () => {
      if (route.path.includes('/blog')) {
        retainBlogScrollPos(route, body, blogScrollPos); return;
      }
      body.value!.scrollTop = 0;
    });
  },
});



function onRouteChange(route: Route, router: Router, exec: () => void) {
  watch(
    () => route.path,
    async () => {
      await router.isReady();
      exec();
    }
  );
}


async function retainBlogScrollPos(
  route: Route,
  body: Ref<HTMLElement|null>,
  scrollPos: Ref<number>
) {
  if (route.path.includes('/blog/')) {
    scrollPos.value = body.value!.scrollTop;
    body.value!.scrollTop = 0;
  }
  if (route.path == '/blog') {
    body.value!.scrollTop = scrollPos.value;
  }
}
