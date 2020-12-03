import mdHomePages from './home.json';
import { computed, defineComponent } from "vue";
import { useStore } from 'vuex';
import { VuexStore } from '../../vuex/vuex-store';


export default defineComponent({
  setup() {
    const store = useStore<VuexStore>();
    const state = store.state;

    store.commit('page-title', mdHomePages[0].title);

    return {
      content: mdHomePages[0].content,
      title: computed(() => state.pageTitle),
    };
  }
});
