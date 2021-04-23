<template>
  <div class="red33m">
    <ee-titlebar>RED33M Videos</ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <ee-toggle
          class="red33m-toggle"
          legend="Sort By"
          left-text="Oldest"
          right-text="Latest"
          :callback="toggle"
          :prevent="isToggling"
        />
        <div ref="observedEl" class="red33m-video-list">
          <ee-video
            v-for="(v, i) of videos"
            :key="i"
            :video-id="v.id"
            :date="v.date"
            :desc="v.content"
            class="red33m-video"
          >
            {{ v.title }}
          </ee-video>
        </div>
        <!-- Loading footer before videos 'fixes' it to bottom -->
        <ee-footer v-if="videos.length" />
      </div>
    </transition>
  </div>
</template>




<script lang='ts'>
import { computed, defineComponent, onUnmounted, Ref, ref } from "vue";
import { useStore }       from "vuex";
import { VuexStore }      from "@/vuex/vuex-store";
import { useTask }        from "vue-concurrency";
import { APIResponse, useAPI }         from "@/services/api_internal";
// Components
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video.vue";
import eeToggleVue   from "@/components/ui/ee-toggle.vue";



export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-toggle'   : eeToggleVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
  },
  setup() {

    const { videos, getVideoTask } = useVideos();

    const { displayVideoPage,
            observedEl,
            paginatedVideos } = useVideoPagination(videos)
    ;

    const { toggle, isToggling } = useToggle(() => {
      videos.value.reverse();
      displayVideoPage(1, 30);
    });

    const videoTask = getVideoTask(() => { displayVideoPage(1, 30); });
    videoTask.loadVideos();

    return {
      videos: paginatedVideos,
      observedEl,
      isVideoTaskRunning: videoTask.isRunning,
      toggle,
      isToggling,
    };
  }
});


function useVideos() {
  const store  = useStore<VuexStore>();
  const videos = computed(() => store.state.dataCache['red33m']?.slice());
  const api    = useAPI();

  function getVideoTask(onVideosLoaded: () => void) {
    const videoTask = useTask(function*() {
    const resp: APIResponse<any> = yield api.get('/data/red33m/videos.json', null, 'static');
      store.commit('data-cache-add', { name: 'red33m', data: resp.data });
      onVideosLoaded();
    });
    return {
      isRunning: computed(() => videoTask.isRunning),
      loadVideos: () => {
        if (!videos.value) videoTask.perform();
        else onVideosLoaded();
      }
    };
  }

  return {
    videos,
    getVideoTask,
  };
}


function useVideoPagination(videos: Ref<any[]>) {
  const paginatedVideos = ref<any[]>([]);
  const observedEl      = ref<HTMLElement>();
  const visiblePages    = ref(0);

  function displayVideoPage(page: number, amount = 15) {
    visiblePages.value = page;
    paginatedVideos.value = videos.value.slice(0, page * amount);
  }

  const renderVideos = () => {
    const body = document.body;
    if (!observedEl.value) return;
    const thresholdRatio =
      body.scrollTop > 450
        ? 0.65
        : 0.15 // Compensate for page header
    ;
    const threshold = observedEl.value.clientHeight * thresholdRatio;
    if (body.scrollTop > threshold) {
      displayVideoPage(visiblePages.value + 1);
    }
  };

  document.body.addEventListener('scroll', renderVideos);
  onUnmounted(() => document.body.removeEventListener('scroll', renderVideos));

  return { displayVideoPage, observedEl, paginatedVideos };
}


function useToggle(cb: () => void) {
  const isToggling = ref(false);

  function toggle() {
    if (isToggling.value) return;
      cb();
      // Wait for toggle input element to be "checked"
      setTimeout(() => isToggling.value = true, 1);
      // Debounce toggling
      setTimeout(() => isToggling.value = false, 300);
  }

  return { toggle, isToggling };
}

</script>