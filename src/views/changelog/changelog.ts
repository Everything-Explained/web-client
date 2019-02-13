import { Component, Vue, Prop } from 'vue-property-decorator';
import changelogData from './changelog.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Changelog extends Vue {

  @Prop() public page!: string;
  public changelog: IPage[] = [];

  created() {
    changelogData.forEach(v => {
      this.changelog.push({
        title: v.title.split(':').map(v => v.trim()),
        content: v.content,
        date: new Date(v.date)
      })
    })
  }

}