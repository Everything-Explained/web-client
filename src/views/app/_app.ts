import { defineComponent, ref, watch } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { Route } from "../../global-types";

export default defineComponent({
  setup() {
    // const version     = '36';
    // const versionType = 'α';
    const body = ref<HTMLElement|null>();
    // const verDesc = `
    //   We shall carry on by 12's until we reach β;
    //   a shift from the arbitrary past into the ever
    //   present - a gift to Me, Myself, and I.
    // `.trim();

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

    // Prevents needing scroll reset in every view.
    onRouteChange(useRoute(), router, () => {
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
