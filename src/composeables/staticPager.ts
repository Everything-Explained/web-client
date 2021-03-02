import { useDataAPI } from "@/services/api_internal";
import { VuexStore } from "@/vuex/vuex-store";
import { computed, ref, watch } from "vue";
import { useTask } from "vue-concurrency";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

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
  const store      = useStore<VuexStore>();
  const activePage = ref<T|null>();
  const pageURI    = route.value.params.page as string|undefined;
  const pages      = computed(() => store.state.dataCache[url] as T[]);
  const pageTitle  = ref('');

  function displayPage(uri: string) {
    const page = pages.value.find(page => page.uri == uri);
    if (!page) { router.push('/404'); return; }
    activePage.value = page;
    pageTitle.value = page.title;
  }

  const api = useDataAPI();
  const getPageData = useTask(function*() {
    const data = yield api.get(url, console.error);
    store.commit('data-cache-add', { name: url, data });
    // The URL points to a specific page on index load
    if (pageURI) displayPage(pageURI);
  });

  const isRunning = computed(() => getPageData.isRunning);

  function goTo(uri: string) {
    router.push(`${url}/${uri}`);
  }

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

  if (!pages.value) getPageData.perform();
  // An edge case when navigating away from a custom
  // route, then backing the history to that same custom route.
  if (pages.value && pageURI) displayPage(pageURI);

  return {
    goTo,
    pages,
    activePage,
    pageTitle,
    isRunning,
  };
}