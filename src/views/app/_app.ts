import { defineComponent, Ref, ref, watch } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { Route } from "../../global-types";

export default defineComponent({
  setup() {
    // const version     = '36';
    // const versionType = 'α';
    const body = ref<HTMLElement|null>(null);
    const blogScrollPos = ref(0);
    // const verDesc = `
    //   We shall carry on by 12's until we reach β;
    //   a shift from the arbitrary past into the ever
    //   present - a gift to Me, Myself, and I.
    // `.trim();

    const router = useRouter();
    const route = useRoute();

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

    // Prevents needing scroll position reset in every view.
    onRouteChange(route, router, () => {
      if (route.path.includes('/blog')) {
        retainBlogScrollPos(route, body, blogScrollPos); return;
      }
      body.value!.scrollTop = 0;
    });

    return { routes: routeList, body };
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
