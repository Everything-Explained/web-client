import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useURI } from "./useURI";

type URIMap = {
  [key: string]: {
    title: string;
    uri: string;
    data: any[];
  }
}

export function useDynamicPager(url: string) {
  const router      = useRouter();
  const route       = router.currentRoute;
  const pageMap      = {} as URIMap;

  // onRouteChange
  watch(() => route.value.params,
    (params) => {
      if (!route.value.path.includes(url)) return;
      if (!params.uri) return;
    }
  );

  return {
    setDynPages: (pages: { name: string; data: any[]; }[]) => {
      pages.reduce((map, page) => {
        map[page.name] = {
          title: page.name,
          uri: useURI(page.name),
          data: page.data
        };
        return map;
      }, pageMap);
    },

    goTo: (pageName: string) => {
      if (!pageMap[pageName]) {
        router.push('/404');
        throw Error(`dynamicPager()::Missing or Invalid Page Name "${pageName}"`);
      }
      router.push(`/${url}/${pageMap[pageName].uri}`);
    },

    activePage: computed(
      () => Object.values(pageMap).find(page => page.uri == route.value.params.uri)
    ),
  };
}

