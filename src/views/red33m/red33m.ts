import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import titlebar from '../../components/titlebar.vue';
import { VuexStore } from "../../vuex/vuex-store";
import videoIds from './videos.json';
import lazyimg from '../../components/lazyimg.vue';
import toggle from '../../components/toggle.vue';


export default defineComponent({
  components: {
    'title-bar': titlebar,
    'lazy-img': lazyimg,
    'toggle': toggle,
  },
  setup() {
    const store = useStore<VuexStore>();
    const videos = ref(videoIds.slice());
    const isLoading = ref(false);

    store.commit('page-title', 'RED33M');

    const toggle = () => {
      if (isLoading.value) return;
      videos.value.reverse();
      // Wait for toggle input element to be "checked"
      setTimeout(() => isLoading.value = true, 1);
      // Debounce toggling
      setTimeout(() => isLoading.value = false, 300);
    };


    return { videos, toggle, isLoading };
  },
  methods: {
    openVideo(url: string) {
      window.open(url, '_blank');
    }
  }
});
