import { defineComponent } from "vue";
import blogContent from './blog.json';

export default defineComponent({
  setup() {
    return { content: blogContent[0].content };
  }
});