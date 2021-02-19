import { computed, defineComponent } from "vue";
import { useTask } from "vue-concurrency";
import { useStore } from "vuex";
import titlebar from '@/components/layout/ee-titlebar.vue';
import { useDataAPI } from "@/services/api_internal";
import { VuexStore } from "@/vuex/vuex-store";
import EeVideo from '@/components/ui/ee-video.vue';
import Footer from '@/components/layout/ee-footer.vue';

export default defineComponent({
  components: {
    'title-bar': titlebar,
    'ee-video': EeVideo,
    'ee-footer': Footer,
  },
  setup() {
    const store = useStore<VuexStore>();
    const api = useDataAPI();
    const categories = computed(() => store.state.dataCache['library/videos']);

    const getVideos = useTask(function*() {
      const videoData = yield api.get('/library/videos', console.error);
      const videos = [];
      for (const cat in videoData) {
        videos.push({name: cat, videos: videoData[cat]});
      }
      store.commit('data-cache-add', { name: 'library/videos', data: videos });
    });

    getVideos.perform();

    return { categories, };
  }
});