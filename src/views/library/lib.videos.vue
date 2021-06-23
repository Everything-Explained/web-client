<template>
  <div class="lib-vid">
    <ee-titlebar :ease-in="350" :ease-out="350">
      Library Videos
    </ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else-if="categories.length && !showVideos">
        <div class="lib-vid__categories">
          <div v-for="(cat, i) of categories"
               :key="i"
               class="lib-vid-category__container"
          >
            <div class="lib-vid__category">
              <h1 @click="openCategory(cat.videos)">
                {{ cat.name }}
              </h1>
              <div class="lib-vid-category__desc">
                {{ cat.description }}
              </div>
              <h2>Contributing Authors</h2>
              <div class="lib-vid-category__desc --authors">
                <ul>
                  <li v-for="(author, j) of getAuthors(cat.videos)"
                      :key="j"
                      :class="{ '--is-ethan': isEthan(author) }"
                  >
                    {{ author }}
                  </li>
                </ul>
              </div>
              <h2>Latest Video ({{ cat.videos.length }})</h2>
              <div class="lib-vid-category__desc">
                <a :href="toYouTubeLink(getLatestVideo(cat.videos).id)"
                   target="_blank"
                >{{ getLatestVideo(cat.videos).title }}</a>
                <br>
                <span :class="['lib-vid__latest-author',
                               { '--is-ethan': isEthan(getLatestVideo(cat.videos).author) }]"
                > ~ {{ getLatestVideo(cat.videos).author }}</span>
              </div>
            </div>
            <footer>
              Updated {{ useDate(getLatestVideo(cat.videos).date).toRelativeTime() }}
            </footer>
          </div>
        </div>
        <ee-footer />
      </div>
      <div v-else-if="showVideos">
        <div class="lib-vid__video-list">
          <ee-video
            v-for="(v, j) of videoList"
            :key="j"
            class="lib-videos__video"
            :video-id="v.id"
            :desc="v.content"
            :date="v.date"
            :author="v.author"
          >
            {{ v.title }}
          </ee-video>
        </div>
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue"
;
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video.vue";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import useVideos from "@/composeables/useVideos";
import { Video } from "@/typings/global-types";
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";

type VideoCategories = { name: string; description: string; videos: Video[] };

export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
  },
  setup() {
    const { videos: categories, getVideoTask } = useVideos<VideoCategories>('/data/library/videos.json');
    const videoTask = getVideoTask(() => void(0));
    videoTask.loadVideos();

    const showVideos = ref(false);
    const videoList = ref<Video[]>([]);

    return {
      openCategory:    (videos: Video[]) => { videoList.value = videos; showVideos.value = true; },
      getAuthors:      (videos: Video[]) => videos.reduce(toAuthors, [] as string[]),
      getLatestVideo:  (videos: Video[]) => videos[videos.length - 1],
      toYouTubeLink:   (id: string)      => `//www.youtube-nocookie.com/embed/${id}?rel=0`,
      useDate,
      isEthan,
      categories,
      isVideoTaskRunning: videoTask.isRunning,
      showVideos,
      videoList,
    };
  }
});


function toAuthors(authors: string[], video: Video) {
  if (authors.includes(video.author)) return authors;
  authors.push(video.author);
  return authors;
}
</script>


