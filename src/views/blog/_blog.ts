import { defineComponent } from "vue";
import blogPosts from './blog.json';

export default defineComponent({
  setup() {



    return { posts: blogPosts };
  }
});