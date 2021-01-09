import { defineComponent } from "vue";
import { useStore } from "vuex";
import titlebar from '../../components/titlebar.vue';
import { VuexStore } from "../../vuex/vuex-store";

export default defineComponent({
  components: {
    'title-bar': titlebar,
  },
  setup() {
    const store = useStore<VuexStore>();

    store.commit('page-title', 'Videos');
  }
});