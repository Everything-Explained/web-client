import { Vue, Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import changelogData from './changelog.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Changelog extends Vue {

  // From route property /changelog/:page
  @Prop() public page!: string;

  public changelog: IPage[] = [];



  created() {
    let logs = changelogData.map(log => {
      return {
        title: log.title.split(':').map(v => v.trim()),
        content: log.content,
        date: new Date(log.date)
      }
    })

    this.changelog.push(...logs);
  }




}