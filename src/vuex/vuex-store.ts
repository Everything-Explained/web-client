import { createStore } from "vuex";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
  lazyimgCache  : string[];
  dataCache     : { [key: string]: unknown[] };
  filter        : {
    reverseAge: boolean;
    authorIndexMap: number[];
    persist: boolean;
  };
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
      lazyimgCache: [],
      filter: {
        reverseAge: false,
        authorIndexMap: [],
        persist: false,
      },
      dataCache: {},
    };
  },
  mutations: {
    'page-title': (state, text: string) => {
      state.pageTitle = text;
    },
    'filter-update'  : (state, payload: { reverseAge: boolean; authorIndexMap: number[] }) => {
      const { reverseAge, authorIndexMap } = payload;
      state.filter.reverseAge = reverseAge;
      state.filter.authorIndexMap = authorIndexMap;
    },
    'filter-persist' : (state, payload: boolean) => { state.filter.persist = payload; },
    'update-footer'  : () => void(0),
    'open-menu'      : (state) => { state.isMenuOpening = true;  },
    'close-menu'     : (state) => { state.isMenuOpening = false; },
    'lazyimg-cache-add':
      (state, URI: string) => { state.lazyimgCache.push(URI); },
    'data-cache-add':
      (state, payload: { name: string; data: any[] }) =>
          state.dataCache[payload.name] = payload.data.slice()
  }
});