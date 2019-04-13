import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import homeData from './home.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Home extends Vue {

  // From route property /home/:page
  @Prop() public page!: string;

  public home: IPage[] = [];



  created() {
    let homePages = homeData.map(page => {
      return {
        title: page.title.split(':'),
        content: page.content,
        date: new Date(page.date)
      }
    })

    this.home.push(...homePages)
  }




}