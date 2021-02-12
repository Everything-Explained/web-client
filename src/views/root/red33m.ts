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
    const isToggling = ref(false);
    const videos = computed(() => store.state.dataCache['red33m']?.slice());

    const api = useDataAPI();
    const getVideos = useTask(function*() {
      const red33mData = yield api.get(
        '/pages/red33m',
        console.error,
        { userid: localStorage.getItem('userid')! }
      );
      store.commit('data-cache-add', { name: 'red33m', data: red33mData });
    });

    const toggle = () => {
      if (isToggling.value) return;
      videos.value.reverse();
      // Wait for toggle input element to be "checked"
      setTimeout(() => isToggling.value = true, 1);
      // Debounce toggling
      setTimeout(() => isToggling.value = false, 300);
    };

    if (!videos.value) getVideos.perform();

    return {
      videos,
      getVideos,
      toggle,
      isToggling,
    };
  }
});
