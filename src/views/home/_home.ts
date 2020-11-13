// import { Vue, Prop, Component } from 'vue-property-decorator';
import mdHomePages from './home.json';
// import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
// import { IPage } from '@/components/md-paging/md-paging.js';

import { defineComponent } from "vue";



export default defineComponent({
  setup() {
    return { pageContent: mdHomePages[0].content };
  }
});


// @Component({
//   components: {
//     MarkdownPaging
//   }
// })
// export default class Home extends Vue {

//   // From route property /home/:page
//   @Prop() public page!: string;

//   public home: IPage[] = [];



//   created() {
//     this.home.push(
//       ...homeData.map(page => {
//         return {
//           title: page.title.split(':'),
//           content: page.content,
//           date: new Date(page.date)
//         }
//       })
//     )
//   }
// }