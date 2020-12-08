import { createStore } from "vuex";

export interface VuexStore {
  pageTitle     : string;
  isMenuOpening : boolean;
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpening: false,
    };
  },
  mutations: {
    'page-title': (state, text: string) => {
      state.pageTitle = text;
    },
    'open-menu' : (state) => { state.isMenuOpening = true;  },
    'close-menu': (state) => { state.isMenuOpening = false; },
  }
});