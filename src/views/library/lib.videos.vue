<template>
  <div class="lib-vid">
    <ee-titlebar :ease-in="350" :ease-out="350">
      Library Videos
    </ee-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <div class="lib-vid__categories">
          <div v-for="(cat, i) of categories"
               :key="i"
               class="lib-vid-category__container"
          >
            <div class="lib-vid__category">
              <h1>{{ cat.name }}</h1>
              <div class="lib-vid-category__desc">
                Cillum adipisicing do sint velit nisi proident. Mollit minim anim reprehenderit sunt
                ea incididunt elit ipsum sint dolor. Officia esse id occaecat.
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
            </div>
            <footer>Updated {{ useDate(cat.videos[cat.videos.length - 1].date).toRelativeTime() }}</footer>
          </div>
        </div>
        <!-- <div
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
              :author="v.author"
            >
              {{ v.title }}
            </ee-video>
          </div>
        </div> -->
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
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";

type VideoCategories = { name: string; videos: Video[] };

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

    const getAuthors = (videos: Video[]) => {
      return [
        'Ethan Kahn', 'Vojtěch Kantor', 'KeSyia', 'Bilbou Baggins', 'Piccolo', 'Pippa Pig', 'Fievel Moskowitz'
      ]
      // return videos.reduce((authors, video) => {
      //   if (authors.includes(video.author)) return authors;
      //   authors.push(video.author);
      //   return authors;
      // }, [] as string[]);
    };

    return { categories, isVideoTaskRunning: videoTask.isRunning, useDate, getAuthors, isEthan };
  }
});
</script>