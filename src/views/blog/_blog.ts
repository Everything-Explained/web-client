import { defineComponent } from "vue";
import blogPosts from './blog.json';
import icon from '../../components/icon/icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr } from "../../composeables/date-utils";


const extractP = /<p>(.*)<\/p>/;


export default defineComponent({
  components: {
    icon,
  },

  setup() {
    const sortedPosts = blogPosts.sort((d1, d2) => {
      return new Date(d2.date).getTime() - new Date(d1.date).getTime();
    });
    const snippetPosts = sortedPosts.map(post => {
      const snippet = extractP.exec(post.content);
      if (!snippet) throw Error('blog::snippet regex failed');
      post.content = snippet[0];
      post.title = post.title.toUpperCase();
      return post;
    });
    return { posts: snippetPosts };
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