import { computed, defineComponent, ref } from "vue";
import { useStore }       from "vuex";
import { VuexStore }      from "@/vuex/vuex-store";
import { useTask }        from "vue-concurrency";
import { useDataAPI }     from "@/services/api_internal";
// Components
import titlebar from '@/components/layout/titlebar.vue';
import toggle   from '@/components/ui/toggle.vue';
import EEVideo  from '@/components/ui/ee-video.vue';
import Footer   from '@/components/layout/footer.vue';
import EEInput  from '@/components/ui/ee-input-field.vue';
import EEButton from '@/components/ui/ee-button.vue';



export default defineComponent({
  components: {
    'title-bar' : titlebar,
    'toggle'    : toggle,
    'ee-video'  : EEVideo,
    'ee-footer' : Footer,
    'ee-input'  : EEInput,
    'ee-button' : EEButton,
  },
  setup() {
    const store = useStore<VuexStore>();
    const isLoading = ref(false);
    const videos = computed(() => store.state.dataCache['red33m']?.slice());

    const api = useDataAPI();
    const getVideos = useTask(function*() {
      const red33mData = yield api.get('pages', 'red33m');
      store.commit('data-cache-add', { name: 'red33m', data: red33mData });
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

    return {
      videos,
      getVideos,
      toggle,
      isLoading,
    };
  }
});
