<template>
  <div class="blog">
    <ee-titlebar :ease-in="350"
                 :ease-out="350"
                 :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <div v-if="isRunning" class="preloader page" />
      <div v-else>
        <div v-if="!pages.length" class="--no-entries">
          No Blog Entries Yet!
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="pages.length && !activePage"
               key="postInactive"
               class="blog-entries"
          >
            <div v-for="(post, i) of pages"
                 :key="i"
                 class="blog-entry"
                 @click="goTo(post.uri)"
            >
              <h1 class="blog-entry__title">
                {{ post.title }}
              </h1>
              <div class="blog-entry__date">
                <ee-icon class="blog-entry__icon" :type="'calendar'" />
                {{ useDate(post.date).toShortDate() }}
              </div>
              <div class="blog-entry__time">
                <ee-icon class="blog-entry__icon" :type="'clock'" />
                {{ useDate(post.date).to12HourFormat() }}
              </div>
              <article class="blog-entry__summary" v-html="post.summary" />
              <div :class="['blog-entry__author', { 'ethan': isEthan(post.author) }]">
                <ee-icon class="blog-entry__author-icon" :type="'user'" />
                {{ post.author }}
              </div>
            </div>
            <ee-footer />
          </div>
          <div v-else-if="activePage"
               key="postActive"
               class="blog-display"
          >
            <div v-if="activePage.image_header" class="blog-display_image-header">
              <ee-img :src="activePage.image_header" :asset="true" />
            </div>
            <article class="md blog_content" v-html="activePage.content" />
            <ee-footer />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent } from "vue";
import eeIconVue     from '@/components/ui/ee-icon.vue';
import eeTitlebarVue from '@/components/layout/ee-titlebar.vue';
import eeImgVue      from '@/components/ui/ee-img.vue';
import eeFooterVue   from '@/components/layout/ee-footer.vue';
import { useDate }   from "@/composeables/date";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";



interface BlogPost extends StaticPage {
  image_header?: string;
  summary: string;
}


export default defineComponent({
  components: {
    'ee-icon'     : eeIconVue,
    'ee-titlebar' : eeTitlebarVue,
    'ee-img'      : eeImgVue,
    'ee-footer'   : eeFooterVue,
  },

  setup() {
    const pager    = useStaticPager<BlogPost>('/blog');
    const titleRef = computed(
      () => pager.pageTitle.value || 'Blog Entries'
    );

    return {
      ...pager,
      titleRef,
      useDate,
    };
  },

  methods: {
    isEthan(author: string) { return author.trim() == 'Ethan Kahn'; }
  }
});
</script>