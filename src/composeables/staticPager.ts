import { APIResponse, useAPI } from "@/services/api_internal";
import { useDateCache } from "@/state/cache-state";
import { computed, ref, watch } from "vue";
import { useTask } from "vue-concurrency";
import { useRouter } from "vue-router";

export interface StaticPage {
  title: string;
  author: string;
  content: string;
  uri: string;
  date: string;
}

export function useStaticPager<T extends StaticPage>(url: string) {
  const router     = useRouter();
  const route      = router.currentRoute;
  const dataCache  = useDateCache();
  const activePage = ref<T|null>();
  const pageURI    = route.value.params.page as string|undefined;
  const pages      = dataCache.getArrayData<T>(url);
  const pageTitle  = ref('');

  function displayPage(uri: string) {
    const page = pages.value.find(page => page.uri == uri);
    if (!page) { router.push('/404'); return; }
    activePage.value = page;
    pageTitle.value = page.title;
  }

  const api = useAPI();
  const getPageData = useTask(function*() {
    const resp: APIResponse<StaticPage[]> = yield api.get(`/data/${url}.json`, null, 'static');
    dataCache.setArrayData(url, resp.data);
    // The URL points to a specific page on index load
    if (pageURI) displayPage(pageURI);
  });

  const isRunning = computed(() => getPageData.isRunning);

  function goTo(uri: string) {
    router.push(`/${url}/${uri}`);
  }

  // onRouteChange
  watch(() => route.value.params,
    (params) => {
      if (!route.value.path.includes(url)) return;
      if (!params.page) {
        activePage.value = null;
        pageTitle.value = '';
        return;
      }
      displayPage(params.page as string);
    }
  );

  // True when pages are NOT in cache
  if (!pages.value.length) getPageData.perform();

  // An edge case when navigating away from a custom
  // route, then backing the history to that same custom route.
  if (pages.value.length && pageURI) displayPage(pageURI);

  return {
    goTo,
    pages,
    activePage,
    pageTitle,
    isRunning,
  };
}