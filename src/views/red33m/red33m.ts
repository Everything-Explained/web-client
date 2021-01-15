import { computed, defineComponent, ref } from "vue";
import { useStore }       from "vuex";
import { VuexStore }      from "@/vuex/vuex-store";
import { useTask }        from "vue-concurrency";
import { usePageDateAPI } from "../../services/api_data";
// Components
import titlebar  from '@/components/titlebar.vue';
import lazyimg   from '@/components/lazyimg.vue';
import toggle    from '@/components/toggle.vue';
import preloader from '@/components/preloader.vue';


import videoData from './red33m.json';
type Videos = typeof videoData;



export default defineComponent({
  components: {
    'title-bar': titlebar,
    'lazy-img': lazyimg,
    'toggle': toggle,
    preloader,
  },
  setup() {
    const store = useStore<VuexStore>();
    const videos = computed(() => store.state.pageCache['red33m']?.slice());
    const isLoading = ref(false);

    const api = usePageDateAPI();
    const getVideos = useTask(function*() {
      const red33mData = yield api.get('red33m');
      store.commit('page-cache-add', { name: 'red33m', data: red33mData });
    });

    const toggle = () => {
      if (isLoading.value) return;
      videos.value.reverse();
      // Wait for toggle input element to be "checked"
      setTimeout(() => isLoading.value = true, 1);
      // Debounce toggling
      setTimeout(() => isLoading.value = false, 300);
    };

    store.commit('page-title', 'RED33M');
    if (!videos.value) getVideos.perform();

    return { videos, getVideos, toggle, isLoading };
  },
  methods: {
    openVideo(url: string) {
      window.open(url, '_blank');
    }
  }
});
