import { APIResponse, useAPI } from "@/services/api_internal";
import { VuexStore } from "@/vuex/vuex-store";
import { computed } from "vue";
import { useTask } from "vue-concurrency";
import { useStore } from "vuex";


export default function useVideos<T>(uri: string) {
  const store  = useStore<VuexStore>();
  const videos = computed(() => store.state.dataCache[`${uri}`]?.slice() as T[]);
  const api    = useAPI();

  function getVideoTask(onVideosLoaded: () => void) {
    const videoTask = useTask(function*() {
    const resp: APIResponse<any[]> = yield api.get(`${uri}`, null, 'static');
      store.commit('data-cache-add', { name: `${uri}`, data: resp.data });
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