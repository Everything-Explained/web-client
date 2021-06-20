import { StaticPage } from "@/composeables/staticPager";
import { createStore } from "vuex";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
  lazyimgCache  : string[];
  dataCache     : { [key: string]: unknown[] };
  filter        : {
    isOpen: boolean;
    reversed: boolean;
    authorIndexMap: number[];
    isPersisting: boolean;
    pages: StaticPage[];
  };
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
      lazyimgCache: [],
      filter: {
        pages: [],
        isOpen: false,
        reversed: false,
        authorIndexMap: [],
        isPersisting: false,
      },
      dataCache: {},
    };
  },
  mutations: {
    'page-title': (state, text: string) => { state.pageTitle = text; },

    'filter-upd-pages'   : (state, payload) => { state.filter.pages          = payload; },
    'filter-upd-isOpen'  : (state, payload) => { state.filter.isOpen         = payload; },
    'filter-upd-reversed': (state, payload) => { state.filter.reversed       = payload; },
    'filter-upd-map'     : (state, payload) => { state.filter.authorIndexMap = payload.slice(); },
    'filter-upd-persist' : (state, payload) => {
      if (!payload) {
        state.filter = {
          pages: [],
          isOpen: false,
          reversed: false,
          authorIndexMap: [],
          isPersisting: false,
        }; return;
      }
      state.filter.isPersisting = true;
    },

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