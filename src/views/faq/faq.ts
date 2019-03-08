
import { Component, Vue, Prop } from 'vue-property-decorator';
import faqData from './faq.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Faq extends Vue {

  // From route property /faq/:page
  @Prop() public page!: string;

  public faq: IPage[] = [];

  created() {

    let pages = faqData.map(page => {
      return {
        title: page.title.split(':'),
        content: page.content,
        date: new Date(page.date)
      }
    })
    this.faq.push(...pages);
  }

}