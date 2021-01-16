import { defineComponent, ref } from "vue";
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

    const videos = ref([
      { title: 'A video title', id: 'W_H2qeqyHPw' },
      { title: 'Another Video Title', id: 'MkmtRgFOE7Y' }
    ]);

    setTimeout(() => {
      console.log('reversing');
      videos.value.reverse();
    }, 2000);
    // const getVideos = useTask(function*() {
    //   const videos = yield api.get('library', 'videos');
    //   for (const cat in videos) {
    //     console.log(cat);
    //   }
    // });

    // getVideos.perform();

    store.commit('page-title', 'Library Videos');
    return { videos };
  }
});