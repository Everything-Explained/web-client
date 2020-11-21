import mdHomePages from './home.json';
import { defineComponent } from "vue";


export default defineComponent({
  setup() {
    return { content: mdHomePages[0].content };
  }
});
