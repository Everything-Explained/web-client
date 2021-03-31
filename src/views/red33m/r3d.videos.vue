<template>
  <div class="red33m">
    <ee-titlebar>RED33M Videos</ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="getVideos.isRunning" class="preloader page" />
      <div v-else>
        <ee-toggle
          class="red33m-toggle"
          legend="Sort By"
          left-text="Oldest"
          right-text="Latest"
          :callback="toggle"
          :prevent="isToggling"
        />
        <div class="red33m-video-list">
          <ee-video
            v-for="(v, i) of videos"
            :key="i"
            :video-id="v.id"
            :desc="v.content"
            class="red33m-video"
          >
            {{ v.title }}
          </ee-video>
        </div>
        <ee-footer />
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from "vue";
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
    const store = useStore<VuexStore>();
    const isToggling = ref(false);
    const videos = computed(() => store.state.dataCache['red33m']?.slice());

    const api = useAPI();
    const getVideos = useTask(function*() {
      const resp: APIResponse<any> = yield api.get('/data/red33m/videos.json', null, 'static');
      store.commit('data-cache-add', { name: 'red33m', data: resp.data });
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
</script>