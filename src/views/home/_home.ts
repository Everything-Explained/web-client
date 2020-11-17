import mdHomePages from './home.json';
import { defineComponent } from "vue";


export default defineComponent({
  setup() {
    console.log('hello world');
    return { content: mdHomePages[0].content };
  }
});
