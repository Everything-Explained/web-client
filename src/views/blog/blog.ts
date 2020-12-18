import { defineComponent, ref, watch } from "vue";
import blogPosts from './blog.json';
import icon from '../../components/icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr } from "../../composeables/date-utils";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { VuexStore } from "../../vuex/vuex-store";
import titlebar from '../../components/titlebar.vue';
import lazyimg from '../../components/lazyimg.vue';


type BlogPost = typeof blogPosts[0];


export default defineComponent({
  components: {
    icon,
    'title-bar': titlebar,
    'lazy-image': lazyimg,
  },

  setup() {
    const activePost = ref<BlogPost|null>(null);
    const router     = useRouter();
    const route      = useRoute();
    const postURI    = route.params.post as string|undefined;
    const store      = useStore<VuexStore>();
    const title      = ref('Blog Entries')
    ;
    const displayBlogPost = (uri: string) => {
      const post = blogPosts.find(post => post.uri == uri);
      if (!post) { router.push('/404'); return; }
      title.value = post.title;
      activePost.value = post;
    };
    // onBlogRouteChange
    watch(() => route.params,
      async (params) => {
        if (!route.path.includes('/blog')) return;
        if (!params.post) {
          activePost.value = null;
          title.value = 'Blog Entires';
          return;
        }
        displayBlogPost(params.post as string);
      }
    );
    if (postURI) displayBlogPost(postURI);
    store.commit('page-title', title.value)
    ;
    function goTo(uri: string) {
      router.push(`/blog/${uri}`);
    }

    return {
      posts: blogPosts.reverse(), // order by latest first
      activePost,
      goTo,
      onBeforeTransLeave: () => store.commit('page-title', title.value)
    };
  },


  methods: {
    formatDate(isoDateStr: string) {
      return dateToShortMDY(isoDateStr);
    },
    formatTime(isoDateStr: string) {
      return dateTo12HourTimeStr(isoDateStr);
    }
  }
});