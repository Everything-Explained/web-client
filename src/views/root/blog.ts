import { computed, defineComponent, ref, watch } from "vue";
import eeIconVue                                 from '@/components/ui/ee-icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr }   from "@/composeables/date-utils";
import { useRoute, useRouter }                   from "vue-router";
import { useStore }                              from "vuex";
import { VuexStore }                             from "@/vuex/vuex-store";
import titlebar                                  from '@/components/layout/ee-titlebar.vue';
import EEImg                                     from '@/components/ui/ee-img.vue';
import { useTask }                               from 'vue-concurrency';
import { useDataAPI as usePageDataAPI }          from "@/services/api_internal";
import Footer                                    from '@/components/layout/ee-footer.vue';


export default defineComponent({
  components: {
    'ee-icon': eeIconVue,
    'title-bar': titlebar,
    'ee-img': EEImg,
    'ee-footer': Footer,
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

    const pageDataAPI = usePageDataAPI();
    const getBlogPosts = useTask(function*() {
      const blogData = yield pageDataAPI.get('/pages/blog', console.error);
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
    formatDate(isoDateStr: string) {
      return dateToShortMDY(isoDateStr);
    },
    formatTime(isoDateStr: string) {
      return dateTo12HourTimeStr(isoDateStr);
    },
    isEthan(author: string) { return author.trim() == 'Ethan Kahn'; }
  }
});