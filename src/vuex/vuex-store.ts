import { createStore } from "vuex";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
  lazyimgCache  : string[];
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
      lazyimgCache: [],
    };
  },
  mutations: {
    'page-title': (state, text: string) => {
      state.pageTitle = text;
    },
    'open-menu'      : (state) => { state.isMenuOpening = true;  },
    'close-menu'     : (state) => { state.isMenuOpening = false; },
    'lazyimg-cache-add':
      (state, URI: string) => { state.lazyimgCache.push(URI); },
  }
});