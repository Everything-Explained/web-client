import { createStore } from "vuex";

export interface VuexStore {
  pageTitle: string;
  isMenuOpen: boolean;
}

export default createStore<VuexStore>({
  state() {
    return {
      pageTitle: '',
      isMenuOpen: false,
    };
  },
  mutations: {
    'page-title': (state, text: string) => {
      state.pageTitle = text;
    },
    'open-menu' : (state) => { state.isMenuOpen = true;  },
    'close-menu': (state) => { state.isMenuOpen = false; },
  }
});