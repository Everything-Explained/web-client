<template>
  <div class="lib-vid">
    <ee-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <transition name="fade" mode="out-in">
      <div v-if="videoTask.isRunning.value" class="preloader page" />
      <div v-else-if="categories.length && !activePage">
        <div class="lib-vid__categories">
          <div v-for="(cat, i) of categories"
               :key="i"
               class="lib-vid-category__container"
          >
            <div class="lib-vid__category">
              <h1 @click="goTo(cat.name)">
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
              <h2>
                Latest Video
                <span class="lib-vid-category__time">
                  {{ useDate(getLatestVideo(cat.videos).date).toRelativeTime() }}
                </span>
              </h2>
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
          </div>
        </div>
        <ee-footer />
      </div>
      <div v-else-if="activePage">
        <div class="lib-vid__video-list">
          <ee-video
            v-for="(v, j) of (activePage.data || [])"
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
import { computed, defineComponent } from "vue"
;
import eeFooterVue   from "@/components/layout/ee-footer.vue";
import eeVideo       from "@/components/ui/ee-video.vue";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import useVideos from "@/composeables/useVideos";
import { Video } from "@/typings/global-types";
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
import { useDynamicPager } from "@/composeables/dynamicPager";

type VideoCategory = { name: string; description: string; videos: Video[] };

export default defineComponent({
  components: {
    'ee-titlebar' : eeTitlebarVue,
    'ee-video'    : eeVideo,
    'ee-footer'   : eeFooterVue,
  },
  setup() {
    const { videos: categories, getVideoTask } = useVideos<VideoCategory>('/data/library/videos.json');
    const { setDynPages, goTo, activePage, }   = useDynamicPager('library/videos');

    const videoTask = getVideoTask(() => {
      setDynPages(categories.value.map(cat => ({ name: cat.name, data: cat.videos })));
    });

    videoTask.loadVideos();

    return {
      getAuthors:     (videos: Video[]) => videos.reduce(toAuthors, [] as string[]),
      getLatestVideo: (videos: Video[]) => videos[videos.length - 1],
      toYouTubeLink:  (id: string)      => `//www.youtube-nocookie.com/embed/${id}?rel=0`,
      useDate,
      goTo,
      isEthan,
      title        : computed(() => activePage.value?.title || 'Video Categories'),
      categories,
      videoTask,
      activePage,
    };
  }
});




function toAuthors(authors: string[], video: Video) {
  if (authors.includes(video.author)) return authors;
  authors.push(video.author);
  return authors;
}
</script>


