import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useURI } from "./useURI";


type DynamicPage = {
  title: string;
  uri  : string;
  data : any[];
}

type URIMap = { [key: string]: DynamicPage; }



export function useDynamicPager(url: string) {
  const router      = useRouter();
  const route       = router.currentRoute;
  const currentURI  = computed(() => route.value.params.uri);
  const pageMap     = {} as URIMap;
  const activePage  = ref<DynamicPage>();

  function setActivePage() {
    activePage.value = Object.values(pageMap).find(p => p.uri == currentURI.value);
  }

  // onRouteChange
  watch(() => route.value.params,
    (params) => {
      if (!route.value.path.includes(url)) return;
      if (!params.uri) { activePage.value = undefined; return; }
      if (currentURI.value) setActivePage();
    }
  );

  return {
    setDynPages: (pages: { name: string; data: any[]; }[]) => {
      pages.forEach((page) => {
        pageMap[page.name] = {
          title: page.name,
          uri: useURI(page.name),
          data: page.data
        };
      });
      // If route is already pointing to page
      if (currentURI.value) setActivePage();
    },

    goTo: (pageName: string) => {
      const currentPage = pageMap[pageName];
      if (!currentPage) {
        router.push('/404');
        throw Error(`dynamicPager()::Missing or Invalid Page Name "${pageName}"`);
      }
      router.push(`/${url}/${pageMap[pageName].uri}`);
      activePage.value = currentPage;
    },

    activePage,

  };
}

