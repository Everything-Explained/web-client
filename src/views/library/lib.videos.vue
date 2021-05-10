<template>
  <div class="lib-videos">
    <ee-titlebar :ease-in="350" :ease-out="350">
      Library Videos
    </ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <div
          v-for="(cat, i) of videoCategories"
          :key="i"
          class="category"
        >
          <div class="category_name">
            {{ cat.name }}
          </div>
          <div class="cat_video-tray --default-scrollbar">
            <ee-video
              v-for="(v, j) of cat.videos"
              :key="j"
              class="lib-videos_video"
              :video-id="v.id"
              :desc="v.content"
              :date="v.date"
            >
              {{ v.title }}
            </ee-video>
          </div>
        </div>
        <ee-footer />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video.vue";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import useVideos from "@/composeables/useVideos";
import { Video } from "@/typings/global-types";

type VideoCategories = { name: string; videos: Video[] };

export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
  },
  setup() {
    const { videos: videoCategories, getVideoTask } = useVideos<VideoCategories>('/data/library/videos.json');

    const videoTask = getVideoTask(() => void(0));
    videoTask.loadVideos();

    return { videoCategories, isVideoTaskRunning: videoTask.isRunning };
  }
});
</script>