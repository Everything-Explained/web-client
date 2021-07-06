<template>
  <div class="red33m">
    <ee-titlebar>RED33M Videos</ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <ee-filter
          :age-only="true"
          :persist="false"
          :items="rawVideos"
          @filter="onFilter"
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
import useVideos from "@/composeables/useVideos";
import { Video } from "@/typings/global-types";
import { isMobile } from "@/globals";
import eeFilterVue from "@/components/layout/ee-filter.vue";



export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
    'ee-filter'   : eeFilterVue,
  },
  setup() {
    const maxVideosToStart = isMobile() ? 10 : 30;
    const { videos: rawVideos, getVideoTask } = useVideos<Video>('/data/red33m/videos.json');

    const videos = ref<Video[]>([]);

    const { displayVideoPage,
            observedEl,
            paginatedVideos } = useVideoPagination(videos)
    ;

    function onFilter(newVideos: Video[]) {
      videos.value = newVideos;
      displayVideoPage(1, maxVideosToStart);
    }

    const videoTask = getVideoTask(() => { displayVideoPage(1, maxVideosToStart); });
    videoTask.loadVideos();

    return {
      rawVideos,
      videos: paginatedVideos,
      observedEl,
      isVideoTaskRunning: videoTask.isRunning,
      onFilter,
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

</script>