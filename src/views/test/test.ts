import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import titlebar from '../../components/titlebar.vue';
import { VuexStore } from "../../vuex/vuex-store";
import toggle from '../../components/toggle.vue';


export default defineComponent({
  components: {
    'title-bar': titlebar,
    'toggle': toggle,
  },
  setup() {
    const store = useStore<VuexStore>();
    const testRef = ref(0);

    store.commit('page-title', 'test');

    const toggleSort = (state: boolean) => {
      if (state) console.log('toggling right');
      else console.log('toggling left');
    };

    return { testRef, toggleSort };
  },
});