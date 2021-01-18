import { computed, defineComponent } from "vue";
import { useTask } from "vue-concurrency";
import { useStore } from "vuex";
import titlebar from '@/components/titlebar.vue';
import { useDataAPI } from "@/services/api_data";
import { VuexStore } from "@/vuex/vuex-store";
import EeVideo from '@/components/ee-video.vue';

export default defineComponent({
  components: {
    'title-bar': titlebar,
    'ee-video': EeVideo,
  },
  setup() {
    const store = useStore<VuexStore>();
    const api = useDataAPI();
    const categories = computed(() => store.state.dataCache['library/videos']);

    const getVideos = useTask(function*() {
      const videoData = yield api.get('library', 'videos');
      const videos = [];
      for (const cat in videoData) {
        videos.push({name: cat, videos: videoData[cat]});
      }
      store.commit('data-cache-add', { name: 'library/videos', data: videos });
    });

    getVideos.perform();

    store.commit('page-title', 'Library Videos');
    return { categories, };
  }
});