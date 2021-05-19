import { createStore } from "vuex";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
  lazyimgCache  : string[];
  dataCache     : { [key: string]: unknown[] };
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
      lazyimgCache: [],
      dataCache: {},
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
    'data-cache-add':
      (state, payload: { name: string; data: any[] }) =>
          state.dataCache[payload.name] = payload.data.slice()
  }
});