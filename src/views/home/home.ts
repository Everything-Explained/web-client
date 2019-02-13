import { Component, Vue, Prop } from 'vue-property-decorator';
import homeData from './home.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Home extends Vue {

  @Prop() public page!: string;
  public home: IPage[] = [];

  created() {
    homeData.forEach(v => {
      this.home.push({
        title: v.title.split(':').map(v => v.trim()),
        content: v.content,
        date: new Date(v.date)
      })
    })
  }

}