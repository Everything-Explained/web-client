import { defineComponent } from "vue";
import { useStore } from "vuex";
import titlebar from '../../components/titlebar.vue';
import { VuexStore } from "../../vuex/vuex-store";
import videoIds from './videos.json';
import lazyimg from '../../components/lazyimg.vue';

// thumbnail API
// https://img.youtube.com/vi/MkmtRgFOE7Y/0.jpg
export default defineComponent({
  components: {
    'title-bar': titlebar,
    'lazy-img': lazyimg,
  },
  setup() {
    const store = useStore<VuexStore>();

    store.commit('page-title', 'Red33m Videos');

    return { videos: videoIds };
  },
  methods: {
    openVideo(url: string) {
      window.open(url, '_blank');
    }
  }
});