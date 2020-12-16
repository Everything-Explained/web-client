import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import titlebar from '../../components/titlebar.vue';
import { VuexStore } from "../../vuex/vuex-store";
import videoIds from './videos.json';
import lazyimg from '../../components/lazyimg.vue';
import toggle from '../../components/toggle.vue';

// thumbnail API
// https://img.youtube.com/vi/MkmtRgFOE7Y/0.jpg
export default defineComponent({
  components: {
    'title-bar': titlebar,
    'lazy-img': lazyimg,
    'toggle': toggle,
  },
  setup() {
    const store = useStore<VuexStore>();
    const videos = ref(videoIds);

    store.commit('page-title', 'Red33m Videos');

    const toggle = () => { videos.value.reverse(); };

    return { videos, toggle };
  },
  methods: {
    openVideo(url: string) {
      window.open(url, '_blank');
    }
  }
});