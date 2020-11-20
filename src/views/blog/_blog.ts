import { defineComponent, Ref, ref, watch } from "vue";
import blogPosts from './blog.json';
import icon from '../../components/icon/icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr } from "../../composeables/date-utils";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";


type BlogPost = typeof blogPosts[0];
type Route = RouteLocationNormalizedLoaded;

const extractP = /<p>.*<\/p>/;


export default defineComponent({
  components: {
    icon,
  },

  setup() {
    const activePost = ref('');
    const router     = useRouter();
    const route      = useRoute();
    const postURI    = route.params.post as string|undefined;

    const sortedPosts = sortPosts(blogPosts);
    const shortPosts  = shortenPostContent(sortedPosts);

    detectPageRoute(route, router, sortedPosts, activePost);
    if (postURI) displayBlogPost(postURI, sortedPosts, router, activePost);

    function readPost(post: BlogPost) {
      router.push(`/blog/${post.uri}`);
    }

    return {
      posts: shortPosts,
      activePost,
      readPost,
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

function shortenPostContent(posts: BlogPost[]) {
  return posts.map(post => {
    const snippet = extractP.exec(post.content);
    if (!snippet) throw Error('blog::snippet regex failed');
    return {
      ...post,
      content: snippet[0]
    };
  });
}

function detectPageRoute(route: Route, router: Router, posts: BlogPost[], contentRef: Ref<string>) {
  watch(
    () => route.params,
    async (params) => {
      if (!route.path.includes('/blog')) return;
      if (!params.post) { contentRef.value = ''; return; }
      displayBlogPost(params.post as string, posts, router, contentRef);
    }
  );
}

function displayBlogPost(uri: string, posts: BlogPost[], router: Router, contentRef: Ref<string>) {
  const post = posts.find(post => post.uri == uri);
  if (!post) { router.push('/404'); return; }
  contentRef.value = post.content;
}