<template>
  <div class="blog">
    <title-bar :ease-in="350"
               :ease-out="350"
               :text="title"
    />
    <transition name="fade" mode="out-in">
      <div v-if="getBlogPosts.isRunning" class="preloader page" />
      <div v-else>
        <div v-if="!posts.length" class="--no-entries">
          No Blog Entries Yet!
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="posts.length && !activePost"
               key="postInactive"
               class="blog-entries"
          >
            <div v-for="(post, i) of posts"
                 :key="i"
                 class="blog-entry"
                 @click="goTo(post.uri)"
            >
              <h1 class="blog-entry__title">
                {{ post.title }}
              </h1>
              <div class="blog-entry__date">
                <ee-icon class="blog-entry__icon" :type="'calendar'" />
                {{ formatDate(post.date) }}
              </div>
              <div class="blog-entry__time">
                <ee-icon class="blog-entry__icon" :type="'clock'" />
                {{ formatTime(post.date) }}
              </div>
              <article class="blog-entry__summary" v-html="post.summary" />
              <div :class="['blog-entry__author', { 'ethan': isEthan(post.author) }]">
                <ee-icon class="blog-entry__author-icon" :type="'user'" />
                {{ post.author }}
              </div>
            </div>
            <ee-footer />
          </div>
          <div v-else-if="activePost"
               key="postActive"
               class="blog-display"
          >
            <div v-if="activePost.image_header" class="blog-display_image-header">
              <ee-img :src="activePost.image_header" :asset="true" />
            </div>
            <article class="md blog_content" v-html="activePost.content" />
            <ee-footer />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent, ref, watch } from "vue";
import { dateToShortMDY, dateTo12HourTimeStr }   from "@/composeables/date-utils";
import { useRoute, useRouter }                   from "vue-router";
import { useStore }                              from "vuex";
import { VuexStore }                             from "@/vuex/vuex-store";
import { useTask }                               from 'vue-concurrency';
import { useDataAPI }                            from "@/services/api_internal"
;
import eeIconVue     from '@/components/ui/ee-icon.vue';
import eeTitlebarVue from '@/components/layout/ee-titlebar.vue';
import eeImgVue      from '@/components/ui/ee-img.vue';
import eeFooterVue   from '@/components/layout/ee-footer.vue';



export default defineComponent({
  components: {
    'ee-icon'   : eeIconVue,
    'title-bar' : eeTitlebarVue,
    'ee-img'    : eeImgVue,
    'ee-footer' : eeFooterVue,
  },

  setup() {
    const activePost = ref<any|null>(null);
    const router     = useRouter();
    const route      = useRoute();
    const postURI    = route.params.post as string|undefined;
    const store      = useStore<VuexStore>();
    const title      = ref('Blog Entries')
    ;
    const posts = computed(() => store.state.dataCache['blog']);
    const displayBlogPost = (uri: string) => {
      const post = posts.value.find(post => post.uri == uri);
      if (!post) { router.push('/404'); return; }
      title.value = post.title;
      activePost.value = post;
    };

    const dataAPI = useDataAPI();
    const getBlogPosts = useTask(function*() {
      const blogData = yield dataAPI.get('/pages/blog', console.error);
      store.commit('data-cache-add', { name: 'blog', data: blogData });
      // The URL points to a specific blog-post on page load
      if (postURI) displayBlogPost(postURI);
    });

    const goTo = (uri: string) => { router.push(`/blog/${uri}`); };

    // onBlogRouteChange
    watch(() => route.params,
      async (params) => {
        if (!route.path.includes('/blog')) return;
        if (!params.post) {
          activePost.value = null;
          title.value = 'Blog Entries';
          return;
        }
        displayBlogPost(params.post as string);
      }
    );

    if (!posts.value) getBlogPosts.perform();
    // An edge case when navigating away from a blog post to a
    // non-blog page, then backing the history to that blog post.
    if (posts.value && postURI) displayBlogPost(postURI);

    return {
      getBlogPosts,
      posts, // order by latest first
      activePost,
      goTo,
      title,
    };
  },

  methods: {
    formatDate(isoDateStr: string) { return dateToShortMDY(isoDateStr); },
    formatTime(isoDateStr: string) { return dateTo12HourTimeStr(isoDateStr); },
    isEthan(author: string)        { return author.trim() == 'Ethan Kahn'; }
  }
});
</script>