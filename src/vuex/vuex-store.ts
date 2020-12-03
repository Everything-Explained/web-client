import { createStore } from "vuex";

export interface VuexStore {
  headerText: string;
  isMenuOpen: boolean;
}

export default createStore<VuexStore>({
  state() {
    return {
      headerText: '',
      isMenuOpen: false,
    };
  },
  mutations: {
    setHeader(state, text: string) {
      state.headerText = text;
    },
    openMenu(state)  { state.isMenuOpen = true;  },
    closeMenu(state) { state.isMenuOpen = false; },
  }
});