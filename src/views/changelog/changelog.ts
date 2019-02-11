
import { Component, Vue } from 'vue-property-decorator';
import chglog from './changelog.json';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Changelog extends Vue {

  public changelog: IPage[] = [];
  public selected = '';

  created() {
    chglog.forEach(v => {
      this.changelog.push({
        title: v.title.split(':').map(v => v.trim()),
        content: v.content,
        date: new Date(v.date)
      })
    })
  }



  beforeRouteUpdate(to, from, next) {
    if (to.params.log) {
      this.selected = to.params.log;
    }
    next();
  }

}