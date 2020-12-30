import { createStore } from "vuex";
import { BlogPost } from "../views/blog/blog";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
  lazyimgCache  : string[];
  pageCache     : { [key: string]: any[] };
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
      lazyimgCache: [],
      pageCache: {},
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
    'page-cache-add':
      (state, payload: { name: string; data: any[] }) =>
          state.pageCache[payload.name] = payload.data.slice()
  }
});