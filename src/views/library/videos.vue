<template>
  <div class="lib-videos">
    <title-bar :ease-in="350" :ease-out="350">
      Library Videos
    </title-bar>
    <transition name="fade" mode="out-in">
      <div v-if="!categories" class="preloader page" />
      <div v-else>
        <div v-for="(cat, i) of categories"
             :key="i"
             class="category"
        >
          <div class="category_name">
            {{ cat.name }}
          </div>
          <div class="cat_video-tray --default-scrollbar">
            <ee-video v-for="(v, j) of cat.videos"
                      :key="j"
                      class="lib-videos_video"
                      :video-id="v.id"
                      :desc="v.content"
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
import { computed, defineComponent } from "vue";
import { useTask } from "vue-concurrency";
import { useStore } from "vuex";
import { useDataAPI } from "@/services/api_internal";
import { VuexStore } from "@/vuex/vuex-store"
;
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";



export default defineComponent({
  components: {
    'title-bar' : eeTitlebarVue,
    'ee-video'  : eeVideo,
    'ee-footer' : eeFooterVue,
  },
  setup() {
    const store      = useStore<VuexStore>();
    const api        = useDataAPI();
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
</script>