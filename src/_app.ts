import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const version     = '36';
    const versionType = 'α';
    // const verDesc = `
    //   We shall carry on by 12's until we reach β;
    //   a shift from the arbitrary past into the ever
    //   present - a gift to Me, Myself, and I.
    // `.trim();

    const router = useRouter();

    const routes     = router.getRoutes();
    const realRoutes = routes.filter(route => route.meta.display == true);
    const orderedRoutes = realRoutes.sort((r1, r2) => {
      return r1.meta.order - r2.meta.order;
    });

    return { version, versionType, routes: orderedRoutes };
  },
  methods: {
    test() {
      console.log('testing 123');
    }
  }
});