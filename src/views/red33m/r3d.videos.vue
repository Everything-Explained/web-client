<template>
  <div class="red33m">
    <ee-titlebar>RED33M Videos</ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <ee-toggle
          class="red33m-toggle"
          left-text="Oldest"
          right-text="Latest"
          :prevent="isToggling"
          @toggle="toggle"
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
import { defineComponent, onUnmounted, Ref, ref } from "vue";
// Components
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video.vue";
import eeToggleVue   from "@/components/ui/ee-toggle.vue";
import useVideos from "@/composeables/useVideos";
import { Video } from "@/typings/global-types";
import { isMobile } from "@/globals";



export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-toggle'   : eeToggleVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
  },
  setup() {
    const maxVideosToStart = isMobile() ? 10 : 30;
    const { videos, getVideoTask } = useVideos<Video>('/data/red33m/videos.json');

    const { displayVideoPage,
            observedEl,
            paginatedVideos } = useVideoPagination(videos)
    ;

    const { toggle, isToggling } = useToggle(() => {
      videos.value.reverse();
      displayVideoPage(1, maxVideosToStart);
    });

    const videoTask = getVideoTask(() => { displayVideoPage(1, maxVideosToStart); });
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


function useVideoPagination(videos: Ref<Video[]>) {
  const paginatedVideos = ref<Video[]>([]);
  const observedEl      = ref<HTMLElement>();
  const visiblePages    = ref(0);

  function displayVideoPage(page: number, amount = isMobile() ? 5 : 30) {
    visiblePages.value = page;
    paginatedVideos.value = videos.value.slice(0, page * amount);
  }

  function renderVideos() {
    if (!observedEl.value) return;
    const body          = document.body;
    const maxScrollDist = body.scrollHeight - window.innerHeight;
    const renderDist    = maxScrollDist - 700
    ;
    if (body.scrollTop >= renderDist) {
      displayVideoPage(visiblePages.value + 1);
    }
  }

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