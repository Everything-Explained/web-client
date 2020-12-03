import { defineComponent, Ref, ref, watch } from "vue";
import blogPosts from './blog.json';
import icon from '../../components/icon/icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr } from "../../composeables/date-utils";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { Store, useStore } from "vuex";
import { VuexStore } from "../../vuex/vuex-store";


type BlogPost = typeof blogPosts[0];
type BlogPostRef = Ref<BlogPost|null>;
type Route = RouteLocationNormalizedLoaded;

const extractP = /<p>.*<\/p>/;


export default defineComponent({
  components: {
    icon,
  },

  setup() {
    const activePost = ref<BlogPost|null>(null);
    const router     = useRouter();
    const route      = useRoute();
    const postURI    = route.params.post as string|undefined;
    const store      = useStore<VuexStore>()
    ;
    const sortedPosts = sortPosts(blogPosts);
    const shortPosts  = shortenPostsContent(sortedPosts)
    ;
    onBlogRouteChange(route, router, sortedPosts, activePost, store);
    if (postURI) displayBlogPost(postURI, sortedPosts, router, activePost, store)
    ;
    function goTo(uri: string) {
      router.push(`/blog/${uri}`);
    }
    store.commit('page-title', 'Blog Entries');
    return {
      posts: shortPosts,
      activePost,
      goTo,
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



function sortPosts(posts: BlogPost[]) {
  return posts.sort((d1, d2) => (
    new Date(d2.date).getTime() - new Date(d1.date).getTime()
  ));
}

function shortenPostsContent(posts: BlogPost[]) {
  return posts.map(post => {
    const snippet = extractP.exec(post.content);
    if (!snippet) throw Error('blog::snippet regex failed');
    return {
      ...post,
      content: snippet[0]
    };
  });
}

function onBlogRouteChange(
    route      : Route,
    router     : Router,
    posts      : BlogPost[],
    contentRef : BlogPostRef,
    store      : Store<VuexStore>,
) {
  watch(
    () => route.params,
    async (params) => {
      if (!route.path.includes('/blog')) return;
      if (!params.post) {
        contentRef.value = null;
        store.commit('page-title', 'Blog Entries');
        return;
      }
      displayBlogPost(params.post as string, posts, router, contentRef, store);
    }
  );
}

function displayBlogPost(
  uri        : string,
  posts      : BlogPost[],
  router     : Router,
  contentRef : BlogPostRef,
  store      : Store<VuexStore>
) {
  const post = posts.find(post => post.uri == uri);
  if (!post) { router.push('/404'); return; }
  store.commit('page-title', post.title);
  contentRef.value = post;
}